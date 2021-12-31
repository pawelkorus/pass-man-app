import React from 'react'
import { Credentials, Provider } from "@aws-sdk/types";
import { authenticateClientIdClientSecret, authenticateCognito } from './auth.api'
import { ConfigContext } from '../../context/config.context'
import { AuthContext } from '../../context/auth.context'

type IdentityPoolAuthProviderProps = {
    children: React.ReactNode
}

export function IdentityPoolAuthProvider({children}:IdentityPoolAuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        if(configContext.state.config) {
            let config = configContext.state.config
            setLoading(true)
            let auth:Provider<Credentials> = null;
            if(config.cognito) {
                auth = await authenticateCognito(config.cognito)  
            } else {
                auth = await authenticateClientIdClientSecret(config.clientIdSecret)
            }
            setCredentials(auth())
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
