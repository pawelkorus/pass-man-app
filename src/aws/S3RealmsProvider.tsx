import React from 'react';
import { RealmsContext, RealmDefinition } from "../context/realms.context"
import { ConfigContext } from '../context/config.context';
import { AuthContext } from '../context/auth.context';
import { setupRealms, fetchRealms, pushRealms } from './realms.api'

type RealmsProviderProps = {
    children:React.ReactNode
}

export default function ({children}:RealmsProviderProps) {
    const actions = {actions: {
        pushRealms: pushRealmsAndUpdateState,
        addRealm: addRealm,
        removeRealm: removeRealm,
        updateRealm: updateRealm      
    }}
    const [realms, setRealms] = React.useState<RealmDefinition[]>(null)
    const configContext = React.useContext(ConfigContext)
    const authContext = React.useContext(AuthContext)
    React.useEffect(() => { loadRealms() }, [configContext.state.config, authContext.state.credentials])
    
    async function loadRealms() {
        if(configContext.state.config && authContext.state.credentials) {
            setupRealms(configContext.state.config.source, () => Promise.resolve(authContext.state.credentials))
            let data = await fetchRealms()
            setRealms(data)
        }
    }

    async function pushRealmsAndUpdateState() {
        let storedRealms = await pushRealms(realms)
        setRealms(storedRealms)
    }

    function addRealm(realm:RealmDefinition) {
        setRealms(realms.concat(realm))
    }

    function removeRealm(realm:RealmDefinition) {
        setRealms(prev => prev.filter(item => item.id != realm.id))
    }

    function updateRealm(realm:RealmDefinition) {
        let updated = realms.map(item => {
             if(item.id == realm.id) {
                 console.log(realm)
                 return realm;
             }
             return item;
        })
        setRealms(updated)
    }

    return (
<RealmsContext.Provider value={{...{ state:{ realms:realms }}, ...actions}}>
    {children}
</RealmsContext.Provider>
)
}
