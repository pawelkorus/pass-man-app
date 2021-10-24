import React from 'react'
import { Config, fetchConfig } from '../config'

export type ConfigContextProps = {
    state: {
        loading:boolean,
        config:Config
    }
}

export const ConfigContext = React.createContext<ConfigContextProps>({state: {config: null, loading: true}})

type ConfigProviderProps = {
    children: React.ReactNode
}

export function ConfigProvider({children}:ConfigProviderProps) {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState(null)

    const getConfig = async () => {
        setLoading(true)
        let v = await fetchConfig()
        setData(v)
        setLoading(false)        
    }

    React.useEffect(() => {
        getConfig()
    }, [])

    return <ConfigContext.Provider value={{state: {config: data, loading: loading}}}>
        {children}
    </ConfigContext.Provider>
}
