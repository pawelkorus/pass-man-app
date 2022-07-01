import React from 'react'
import { Credentials } from "@aws-sdk/types";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { createOIDCClient, ErrorResult, IdTokenResult, IssuerConfig } from "../../oauth2";
import { ConfigContext, AuthContext, Config } from "../../api"
import { AWSAuthentication } from "..";
import { IdToken } from '../../oauth2/common';

type IdentityPoolAuthProviderProps = {
    children: React.ReactNode
}

export type IdentityPoolAuthConfig = Config & {
    cognito: IdentityPoolProperties
}

type IdentityPoolProperties = {
    identityPoolId:string,
    region: string,
    issuer: string | IssuerConfig
    clientId: string,
    grantType: "code" | "token"
}

function validateIdentityPoolAuthConfig(config:Config):config is IdentityPoolAuthConfig {
    const identityPoolProperties = (config as IdentityPoolAuthConfig)?.cognito

    return validateType<IdentityPoolProperties>(identityPoolProperties, {
        clientId: "string",
        identityPoolId: "string",
        issuer: "object",
        grantType: "string",
        region: "string"
    })
}

function validateType<T>(data:any, schema:Record<keyof T, string>, ): data is T {  
    const missingProperties = Object.keys(schema)
        .filter(key => data[key] === undefined)
        .map(key => key as keyof T)
        .map(key => new Error(`Document is missing ${String(key)} ${schema[key]}`));

    return missingProperties.length == 0
}

export function IdentityPoolAuthProvider({children}:IdentityPoolAuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState<AWSAuthentication>(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        const config = configContext.state.config
        
        if(!config) {
            return //skip
        }
        
        if(!validateIdentityPoolAuthConfig(config)) {
            throw new Error("Invalid configuration. Required properties not found")
        }
        
        const options = config.cognito
        const client = await createOIDCClient(options.issuer)
        const authorizationRequest = {
            clientId: options.clientId,
            redirectUri: window.location.origin,
            scope: "openid"
        }
        const issuerUrl = new URL(client.issuer)
        
        let result:IdTokenResult | ErrorResult
        if(options.grantType == "token") {
            result = await client.implicitFlow(authorizationRequest)
        } else {
            result = await client.authorizationCodeFlow(authorizationRequest)
        }

        if(result.result == "success") {
            const awsCredentialsProvider = fromCognitoIdentityPool({
                identityPoolId: config.cognito.identityPoolId,
                logins: {
                    [issuerUrl.hostname + issuerUrl.pathname]: result.idToken.rawToken
                },
                clientConfig: {
                    region: config.cognito.region
                }
            })
            const congnitoIdentityCredentials = await awsCredentialsProvider()
            setCredentials(toAuthentication(result.idToken, congnitoIdentityCredentials))
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

function toAuthentication(token:IdToken, credentials:Credentials):AWSAuthentication {
    return {
        principal: token.sub || "",
        ...credentials
    }
}
