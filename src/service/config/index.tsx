import React from 'react'
import { S3RealmsConfig } from '../../aws'
import { IdentityPoolAuthConfig, ClientIdSecretConfig } from '../../aws'
import { ConfigContext } from '../../context/config.context'
import { Config } from '../../api'

type ConfigProviderProps = {
    children: React.ReactNode
}

export type AppConfig = Config & IdentityPoolAuthConfig & ClientIdSecretConfig & S3RealmsConfig


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

const fetchConfig = async():Promise<Config> => {
    let response = await fetch("/config.json")
    return response.json()
}
