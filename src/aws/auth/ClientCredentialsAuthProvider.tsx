import React from 'react'
import { Credentials, Provider } from "@aws-sdk/types";
import { Config, ConfigContext, AuthContext } from '../../api'

export type ClientIdSecretConfig = Config & {
    clientIdSecret: ClientIdSecretProperties 
}

export function ClientCredentialsAuthProvider({children}:ClientCredentialsAuthProviderProps) {
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
        if(isClientIdSecretConfig(config)) {
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

type ClientCredentialsAuthProviderProps = {
    children: React.ReactNode
}

type ClientIdSecretProperties = {
    clientId: string
    clientSecret: string
}

function isClientIdSecretConfig(config:Config):config is ClientIdSecretConfig {
    const clientIdSecretProperties = (config as ClientIdSecretConfig).clientIdSecret
    return clientIdSecretProperties?.clientId !== undefined 
        && clientIdSecretProperties?.clientSecret !== undefined
}

async function authenticateClientIdClientSecret(credentials:ClientIdSecretProperties):Promise<Provider<Credentials>> {  
    const prov:Provider<Credentials> = () => new Promise<Credentials>(resolve => {
                resolve({
                    accessKeyId: credentials.clientId,
                    secretAccessKey: credentials.clientSecret
                })
            })
    
    return new Promise(resolve => {
        resolve(prov)
    })
}
