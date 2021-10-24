import { default as React, useEffect, useState } from 'react';
import { RealmsContextInterface, RealmsContext } from "../context/realms.context"
import { setupRealms, fetchRealms, pushRealms, RealmDefinition } from "../service"
import { Config, fetchConfig } from "../config"
import { Credentials, Provider } from "@aws-sdk/types";
import { config } from 'webpack';

type Props = {
    credentials: Provider<Credentials>
    children: React.ReactNode,
};

export default function S3RealmsProvider({ credentials, children }:Props) {
    useEffect(() => {
        fetchConfig()
            .then((c:Config) => {
                setupRealms(c.source, credentials)
            })
            .then(fetchRealms)
            .then((realms) => {
                setRealms(realms)
            })
    }, [])
    
    const [realms, setRealms] = useState([])
    const value = { 
        realms: realms,
        //fetchRealms: fetchRealms;,
        pushRealms: (updatedRealms:RealmDefinition[]) => {
            return pushRealms(updatedRealms)
                .then((realms) => {
                    setRealms(realms)
                    return realms
                })
        }
    }
    
    return (
<RealmsContext.Provider value={value}>
    {children}
</RealmsContext.Provider>
    ) 
}
