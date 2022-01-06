import React from 'react'
import { Credentials, Provider } from "@aws-sdk/types";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { ConfigContext, AuthContext, Config } from '../../api'
import { IdentityPoolProperties } from './common'
import { isIdentityPoolAuthConfig, secureRandomString, secureRandomNumber } from './private'
import { AWSAuthentication } from '..';

type IdentityPoolAuthProviderProps = {
    children: React.ReactNode
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
        
        if(!isIdentityPoolAuthConfig(config)) {
            throw new Error("Invalid configuration. Required properties not found")
        }
        
        const authenticationProvider = authenticateTokenFlow(config.cognito)
        const authentication = await authenticationProvider().then(validateCredentials)
        setCredentials(authentication)
        setLoading(false)
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

type FragmentParams = { 
    [name: string]: string
};

function authenticateTokenFlow(options:IdentityPoolProperties):Provider<Credentials> {
    const fragmentString = window.location.hash.substring(1);
    const fragmentParams:FragmentParams = {}

    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(fragmentString))) {
        fragmentParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    const preservedState = window.sessionStorage.getItem('cognito_state');

    if(fragmentParams["id_token"] && fragmentParams["state"] == preservedState) {
    
        window.location.hash = "";
        return fromCognitoIdentityPool({
            identityPoolId: options.identityPoolId,
            logins: {
                [options.provider.name]: fragmentParams['id_token']
            },
            clientConfig: {
                region: options.region
            }
        })

    } else {
        
        const state = secureRandomString();
        window.sessionStorage.setItem('cognito_state', state);

        const authRequestParams = { 
            response_type: options.provider.responseType,
            client_id: options.provider.clientId,
            redirect_uri: window.location.origin,
            scope: options.provider?.scope,
            state: state,
            nonce: ''+secureRandomNumber()
        }
        
        window.location.href = options.provider.authorizeEndpoint + "?" + new URLSearchParams(authRequestParams).toString();

        return () => Promise.reject("Redirecting browser")
    }
}
