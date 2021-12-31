import React from 'react'
import { Config } from './types'

export type ConfigContextProps = {
    state: {
        loading:boolean,
        config:Config
    }
}

export const ConfigContext = React.createContext<ConfigContextProps>({state: {config: null, loading: true}})


