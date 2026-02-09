import React from 'react'
import { AwsCredentialIdentity, Provider } from "@aws-sdk/types";
import { Config, ConfigContext, AuthContext } from '../../api'
import { AWSAuthentication } from '..';

export type ClientIdSecretConfig = Config & {
    clientIdSecret: ClientIdSecretProperties
}

export function ClientCredentialsAuthProvider({children}:ClientCredentialsAuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState<AWSAuthentication>(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        const config = configContext.state.config

        if(!configContext.state.config) {
            return //skip
        }

        if(!isClientIdSecretConfig(config)) {
            throw new Error("Invalid configuration. Required properties not found")
        }

        const credentials = await authenticateClientIdClientSecret(config.clientIdSecret)()
        setCredentials(toAuthentication(config.clientIdSecret.clientId, credentials))
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

function toAuthentication(clientId:string, credentials:AwsCredentialIdentity):AWSAuthentication {
    return {
        principal: clientId,
        ...credentials
    }
}

function isClientIdSecretConfig(config:Config):config is ClientIdSecretConfig {
    const clientIdSecretProperties = (config as ClientIdSecretConfig).clientIdSecret
    return clientIdSecretProperties?.clientId !== undefined
        && clientIdSecretProperties?.clientSecret !== undefined
}

function authenticateClientIdClientSecret(credentials:ClientIdSecretProperties):Provider<AwsCredentialIdentity> {
    return () => Promise.resolve({
                    accessKeyId: credentials.clientId,
                    secretAccessKey: credentials.clientSecret
                });
}
