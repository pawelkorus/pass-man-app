import React from 'react'
import { Authentication } from '../api'

export type AuthContextProps = {
    state: {
        loading:boolean,
        authentication:Authentication
    }
}

export const AuthContext = React.createContext<AuthContextProps>({state: {loading: true, authentication: null }})
