import React from 'react';
import { RealmsContext } from "../context/realms.context"
import { setupRealms, fetchRealms, pushRealms, RealmDefinition } from "../service"
import { ConfigContext } from '../context/config.context';
import { AuthContext } from '../context/auth.context';

type RealmsProviderProps = {
    children:React.ReactNode
}

export default function ({children}:RealmsProviderProps) {
    var [realms, setRealms] = React.useState(null)
    var configContext = React.useContext(ConfigContext)
    var authContext = React.useContext(AuthContext)
    React.useEffect(() => { loadRealms() }, [configContext.state.config, authContext.state.credentials])
    
    async function loadRealms() {
        if(configContext.state.config && authContext.state.credentials) {
            setupRealms(configContext.state.config.source, () => Promise.resolve(authContext.state.credentials))
            let data = await fetchRealms()
            setRealms(data)
        }
    }

    async function pushRealmsAndUpdateState(updateRealms:RealmDefinition[]) {
        let storedRealms = await pushRealms(updateRealms)
        setRealms(storedRealms)
    }

    return (
<RealmsContext.Provider value={{state:{ realms:realms }, actions:{ pushRealms: pushRealmsAndUpdateState }}}>
    {children}
</RealmsContext.Provider>
)
}
