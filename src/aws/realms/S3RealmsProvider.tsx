import React from 'react';
import { RealmsContext, RealmDefinition, State } from "../../api"
import { ConfigContext } from '../../api/config.context';
import { AuthContext } from '../../api/auth.context';
import { setupRealms, fetchRealms, pushRealms, S3RealmsProperties } from './realms.api'
import { AWSAuthentication } from '../common'
import { Authentication, Config } from '../../api'

type RealmsProviderProps = {
    children:React.ReactNode
}

export type S3RealmsConfig = Config & {
    source: S3RealmsProperties
}

export function S3RealmsProvider({children}:RealmsProviderProps) {
    const actions = {actions: {
        pushRealms: pushRealmsAndUpdateState,
        addRealm: addRealm,
        removeRealm: removeRealm,
        updateRealm: updateRealm      
    }}
    const [state, setState] = React.useState<State>(State.LOADING)
    const [realms, setRealms] = React.useState<RealmDefinition[]>(null)
    const configContext = React.useContext(ConfigContext)
    const authContext = React.useContext(AuthContext)
    React.useEffect(() => { loadRealms() }, [configContext.state.config, authContext.state.authentication])
    
    async function loadRealms() {
        const config = configContext.state.config
        const auth = authContext.state.authentication
        
        if(!config || !auth) {
            return //skip
        }
        
        if(!isS3RealmsConfig(config)) {
            throw new Error("Invalid configuration object. Required properties not found")
        }

        if(!isAWSAuthentication(auth)) {
            throw new Error("Unsuppported authentication object")
        }

        setupRealms(config.source, auth)
        let data = await fetchRealms()
        setRealms(data)
        setState(State.READY)
    }

    async function pushRealmsAndUpdateState() {
        setState(State.SAVING)
        let storedRealms = await pushRealms(realms)
        setRealms(storedRealms)
        setState(State.READY)
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
<RealmsContext.Provider value={{...{ state:{ state: state, realms:realms }}, ...actions}}>
    {children}
</RealmsContext.Provider>
)
}

function isS3RealmsConfig(config:Config):config is S3RealmsConfig {
    const s3RealmsConfig = (config as S3RealmsConfig)?.source
    return s3RealmsConfig?.bucket !== undefined
        && s3RealmsConfig?.object !== undefined
}

function isAWSAuthentication(auth:Authentication) : auth is AWSAuthentication {
    const hasAccessKeyId = !isEmpty((auth as AWSAuthentication).accessKeyId)
    const hasSecretAccessKey = !isEmpty((auth as AWSAuthentication).secretAccessKey)
    return hasAccessKeyId && hasSecretAccessKey 
}

function isEmpty(str:string) {
    return (!str || str.length === 0 );
}
