import React from 'react'
import { Credentials, Provider } from "@aws-sdk/types";
import { authenticateClientIdClientSecret, authenticateCognito, IdentityPoolProperties, ClientIdSecretProperties } from './auth.api'
import { ConfigContext } from '../../context/config.context'
import { AuthContext } from '../../context/auth.context'
import { Config } from '../../api'

type IdentityPoolAuthProviderProps = {
    children: React.ReactNode
}

export type IdentityPoolAuthConfig = Config & {
    cognito: IdentityPoolProperties
}

export type ClientIdSecretConfig = Config & {
    clientIdSecret: ClientIdSecretProperties 
}


export function IdentityPoolAuthProvider({children}:IdentityPoolAuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        if(!configContext.state.config) {
            return //skip
        }
        
        let config = configContext.state.config
        setLoading(true)
        let auth:Provider<Credentials> = null;
        if(isIdentityPoolAuthConfig(config)) {
            auth = await authenticateCognito(config.cognito)  
        } else if(isClientIdSecretConfig(config)) {
            auth = await authenticateClientIdClientSecret(config.clientIdSecret)
        } else {
            throw new Error("Invalid configuration. Required properties not found")
        }
        setCredentials(auth())
        setLoading(false)
    }

    React.useEffect(() => {
        authenticate()
    }, [configContext.state.config])

    return <AuthContext.Provider value={{state:{loading: loading, authentication: credentials}}}>
        {children}
    </AuthContext.Provider>
}

function isIdentityPoolAuthConfig(config:Config):config is IdentityPoolAuthConfig {
    const identityPoolProperties = (config as IdentityPoolAuthConfig)?.cognito
    return identityPoolProperties?.identityPoolId !== undefined 
        && identityPoolProperties?.clientId !== undefined
}

function isClientIdSecretConfig(config:Config):config is ClientIdSecretConfig {
    const clientIdSecretProperties = (config as ClientIdSecretConfig).clientIdSecret
    return clientIdSecretProperties?.clientId !== undefined 
        && clientIdSecretProperties?.clientSecret !== undefined
}
