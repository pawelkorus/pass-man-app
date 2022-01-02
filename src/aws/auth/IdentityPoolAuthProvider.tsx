import React from 'react'
import { Credentials, Provider } from "@aws-sdk/types";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { ConfigContext, AuthContext, Config } from '../../api'
import { AWSAuthentication } from '..';

type IdentityPoolAuthProviderProps = {
    children: React.ReactNode
}

export type IdentityPoolAuthConfig = Config & {
    cognito: IdentityPoolProperties
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
        
        const authenticationProvider = authenticateCognito(config.cognito)
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

function isIdentityPoolAuthConfig(config:Config):config is IdentityPoolAuthConfig {
    const identityPoolProperties = (config as IdentityPoolAuthConfig)?.cognito
    return identityPoolProperties?.identityPoolId !== undefined 
        && identityPoolProperties?.clientId !== undefined
}

type FragmentParams = { 
    [name: string]: string
};

type IdentityPoolProperties = {
    identityPoolId:string,
    clientId:string
}

function authenticateCognito(options:IdentityPoolProperties):Provider<Credentials> {
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
                'accounts.google.com': fragmentParams['id_token']
            },
            clientConfig: {
                region: 'eu-central-1'
            }
        })

    } else {
        
        const state = secureRandomString();
        window.sessionStorage.setItem('cognito_state', state);

        const authRequestParams = { 
            response_type: 'token id_token',
            client_id: options.clientId,
            redirect_uri: window.location.origin,
            scope: 'openid profile',
            state: state,
            nonce: ''+secureRandomNumber()
        }
        
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams(authRequestParams).toString();

        return () => Promise.reject("Redirecting browser")
    }
}

function secureRandomNumber() {
    const array = new Uint32Array(1);
    return window.crypto.getRandomValues(array);
}

function secureRandomString():string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}
