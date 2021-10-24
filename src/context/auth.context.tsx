import React from 'react'
import { Credentials } from "@aws-sdk/types";
import { authenticateClientIdClientSecret, authenticateCognito } from '../service'
import { ConfigContext } from './config.context'

export type AuthContextProps = {
    state: {
        loading:boolean,
        credentials: Credentials
    }
}

export const AuthContext = React.createContext<AuthContextProps>({state: {loading: true, credentials: null}})

type AuthProviderProps = {
    children: React.ReactNode
}

export function AuthProvider({children}:AuthProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [credentials, setCredentials] = React.useState(null)
    const configContext = React.useContext(ConfigContext)

    const authenticate = async () => {
        if(configContext.state.config) {
            let config = configContext.state.config
            setLoading(true)
            let auth = null;
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

    return <AuthContext.Provider value={{state:{loading: loading, credentials: credentials}}}>
        {children}
    </AuthContext.Provider>
}
