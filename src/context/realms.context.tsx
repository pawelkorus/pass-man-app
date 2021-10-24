import React from 'react';
import { fetchRealms, pushRealms, RealmDefinition, setupRealms } from '../service'
import { ConfigContext } from './config.context'
import { AuthContext } from './auth.context'

export type RealmsContextProps = {
    state: {
        realms:RealmDefinition[]
    },
    actions: {
        pushRealms: (realms:RealmDefinition[]) => void
    }
}

export const RealmsContext = React.createContext<RealmsContextProps>({
    state: {
        realms: []
    },
    actions: {
        pushRealms: (updatedRealms:RealmDefinition[]) => {
            console.error("Realms context not ready yet")    
        }
    }
})

export function useRealms() {
    return React.useContext(RealmsContext)
}
