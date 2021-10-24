import { createContext, useContext } from 'react';
import { RealmDefinition } from '../service'
import { AWSSource } from '../config'
import { Credentials, Provider } from "@aws-sdk/types";

export type RealmsContextInterface = {
     //setupRealms(source:AWSSource, credentials:Provider<Credentials>):void
    
    // fetchRealms():Promise<RealmDefinition[]>

    realms:RealmDefinition[]

    pushRealms(realms:RealmDefinition[]):Promise<RealmDefinition[]>
}

export const RealmsContext = createContext<RealmsContextInterface>({
    /*setupRealms: (source:AWSSource, credentials:Provider<Credentials>) => {
        throw new Error("No Realms context provider setup")
    },*/

    // fetchRealms: ():Promise<RealmDefinition[]> => {
    //     return noRealmsProviderSetup
    // },

    realms:[],

    pushRealms: (realms:RealmDefinition[]):Promise<RealmDefinition[]> => {
        return Promise.reject("No Realms context provider setup")
    }
})

export function useRealms() {
    useContext(RealmsContext)
}
