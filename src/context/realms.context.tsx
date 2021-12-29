import React from 'react';

export interface RealmDefinition {
    realm: string,
    username: string,
    password: string,
    tags: string[],
    id: string,
    persisted: boolean
}

export type RealmsContextProps = {
    state: {
        realms:RealmDefinition[]
    },
    actions: {
        pushRealms: () => void
        addRealm: (realm:RealmDefinition) => void,
        removeRealm: (realm:RealmDefinition) => void,
        updateRealm: (realm:RealmDefinition) => void
    }
}

export const RealmsContext = React.createContext<RealmsContextProps>({
    state: {
        realms: []
    },
    actions: {
        pushRealms: () => {
            console.error(REALMS_CONTEXT_NOT_READY_YET)    
        },
        addRealm: (realm:RealmDefinition) => {
            console.error(REALMS_CONTEXT_NOT_READY_YET)
        },
        removeRealm: (realm:RealmDefinition) => {
            console.error(REALMS_CONTEXT_NOT_READY_YET)
        },
        updateRealm: (realm:RealmDefinition) => {
            console.error(REALMS_CONTEXT_NOT_READY_YET)
        }
    }
})

export function useRealms() {
    return React.useContext(RealmsContext)
}

const REALMS_CONTEXT_NOT_READY_YET = "realms context not ready yet"
