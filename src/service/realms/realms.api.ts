import Papa from "papaparse"
import AWSBackend from "./AWSBackend"
import { AWSSource } from "../../config"
import { Credentials, Provider } from "@aws-sdk/types";
import { each } from "jquery";

let resolveBackend:Function
let resolveSource:Function

const awsBackendPromise = new Promise<AWSBackend>((resolve, reject) => {
    resolveBackend = resolve
})

const awsSourcePromise = new Promise<AWSSource>((resolve, reject) => {
    resolveSource = resolve
})

export interface RealmDefinition {
    realm: string,
    username: string,
    password: string,
    tags: string[],
    id: string,
    persisted: boolean
}

export const setupRealms = function(source:AWSSource, credentials:Provider<Credentials>) {
    resolveBackend(new AWSBackend(source, credentials))
    resolveSource(source)
}

export const fetchRealms = async () => {
    let awsBackend = await awsBackendPromise
    let source = await awsSourcePromise
    let value = await awsBackend.fetchResource(source.bucket, source.object)
    let realms = Papa.parse<RealmDefinition>(value, { header: true, transform: transform }).data
    realms?.forEach(realm => realm.persisted = true)
    return realms
}

export const pushRealms = async (realms:RealmDefinition[]) => {
    let awsBackend = await awsBackendPromise
    let awsSource = await awsSourcePromise
    await awsBackend.storeResource(awsSource.bucket, awsSource.object, Papa.unparse(realms))
    realms?.forEach(realm => realm.persisted = true)
    return realms
}

function transform(value:string, headerName:string) {
    if(headerName == "tags") {
        return value.split(",");
    }
    return value;
}
