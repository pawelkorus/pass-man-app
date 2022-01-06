import React from 'react'
import { Credentials } from "@aws-sdk/types";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { ConfigContext, AuthContext } from '../../api'
import { AuthorizationCodeProviderProperties } from './common'
import { isIdentityPoolAuthConfig, secureRandomString, generateCodeChallengeFromVerifier } from './private';
import { AWSAuthentication } from '..';
import { validateAuthorizationCodeProviderProperties } from '.';

type AuthenticationCodeAuthProviderProps = {
    children: React.ReactNode
}

export function AuthenticationCodeAuthProvider({children}:AuthenticationCodeAuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState<AWSAuthentication>(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        const config = configContext.state.config
        
        if(!config) {
            return //skip
        }
        
        if(!isIdentityPoolAuthConfig(config)) {
            throw new Error("Invalid configuration. Required properties not found")
        }

        const flowOptions = config.cognito.provider
        if(!validateAuthorizationCodeProviderProperties(flowOptions)) {
            throw new Error("Invalid provider configuration")
        }
        
        const result = await authenticateAuthenticationCodeFlow(flowOptions)
        if(result.result == "success") {
            const awsCredentialsProvider = fromCognitoIdentityPool({
                identityPoolId: config.cognito.identityPoolId,
                logins: {
                    [config.cognito.provider.name]: result.token
                },
                clientConfig: {
                    region: config.cognito.region
                }
            })
            const authentication = await awsCredentialsProvider().then(validateCredentials)
            setCredentials(authentication)
            setLoading(false)
        }
    }

    React.useEffect(() => {
        authenticate()
    }, [configContext.state.config])

    return <AuthContext.Provider value={{state:{loading: loading, authentication: credentials}}}>
        {children}
    </AuthContext.Provider>
}

function validateCredentials(credentials:Credentials):AWSAuthentication {
    return credentials as AWSAuthentication
}

async function authenticateAuthenticationCodeFlow(options:AuthorizationCodeProviderProperties):Promise<IdTokenResult | ErrorResult> {
    const queryParams = new URLSearchParams(window.location.search)
    const preservedState = window.sessionStorage.getItem("oauth2_state");
    const code = queryParams.get("code")
    const state = queryParams.get("state")
    const error = queryParams.get("error")
    const codeVerifier = window.sessionStorage.getItem("oauth2_code_verifier")

    if(code != null && state != null && state == preservedState && codeVerifier != null) {
        const bodyParams = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: options.clientId,
            code: code,
            redirect_uri: window.location.origin,
            code_verifier: codeVerifier
        })

        const response = await fetch(options.tokenEndpoint, {
            method: "POST",
            body: bodyParams.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" 
            }              
        })

        if(response.ok) {
            const responseBody = await response.json()
            const idToken = responseBody?.id_token as string
            return Promise.resolve(ofIdTokenResult(idToken))
        } else {
            return Promise.reject(ofErrorResult())
        }
    } else if(error != null && validateError(error) && state != null && state == preservedState) {
        console.error("Authentication failed: " + error)
        return Promise.reject(ofErrorResult())
    } else if(state != null && state != preservedState) {
        return Promise.reject(ofErrorResult())
    } else {
        const state = secureRandomString();
        window.sessionStorage.setItem("oauth2_state", state);
        
        const codeVerifier = secureRandomString();
        window.sessionStorage.setItem("oauth2_code_verifier", codeVerifier)
        
        const {codeChallenge, codeChallengeMethod} = await generateCodeChallengeFromVerifier(codeVerifier)

        const authRequestParams = { 
            response_type: "code",
            client_id: options.clientId,
            redirect_uri: window.location.origin,
            scope: options.scope,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
        }
        
        window.location.href = options.authorizeEndpoint + "?" + new URLSearchParams(authRequestParams).toString();

        return Promise.reject(ofErrorResult())
    }
}


type IdTokenResult = {result: "success", token:string}
function ofIdTokenResult(token:string):IdTokenResult {
    return {result: "success", token:token} as IdTokenResult
}

type ErrorResult = {result: "fail"}
function ofErrorResult() {
    return {result: "fail"} as ErrorResult
}

const validErrors = ["invalid_request", "unauthorized_client", "access_denied",
    "unsupported_response_type", "invalid_scope", "server_error",
    "temporarily_unavailable"] as const
type Error = (typeof validErrors)[number]
function validateError(input:string): input is Error {
    return (validErrors as readonly string[]).includes(input)
}
