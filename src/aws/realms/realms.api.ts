import Papa from "papaparse"
import AWSBackend from "./AWSBackend"
import { RealmDefinition } from "../../api"
import { AWSAuthentication } from "..";

let resolveBackend:(backend:AWSBackend) => void
let resolveSource:(source:S3RealmsProperties) => void
let resolvePrincipal:(prinsipal:string) => void

const awsBackendPromise = new Promise<AWSBackend>(resolve => {
    resolveBackend = resolve
})

const awsSourcePromise = new Promise<S3RealmsProperties>(resolve => {
    resolveSource = resolve
})

const principalPromise = new Promise<string>(resolve => {
    resolvePrincipal = resolve
})


export type S3RealmsProperties = {
    bucket: string
    // @deprecated
    object?: string
    objectPrefix?: string
    objectName?: string
    endpoint?: string
    region?:string
}

export const setupRealms = (source:S3RealmsProperties, credentials:AWSAuthentication) => {
    resolveBackend(new AWSBackend(source, credentials))
    resolveSource(source)
    resolvePrincipal(credentials.principal)
}

export const fetchRealms = async () => {
    const awsBackend = await awsBackendPromise
    const source = await calculateObjectDetails()
    const value = await awsBackend.fetchResource(source.bucket, source.object)
    const realms = Papa.parse<RealmDefinition>(value, { header: true, transform: transform }).data
    realms?.forEach(realm => realm.persisted = true)
    return realms
}

export const pushRealms = async (realms:RealmDefinition[]) => {
    const awsBackend = await awsBackendPromise
    const awsSource = await calculateObjectDetails()
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

async function calculateObjectDetails():Promise<{bucket:string, object: string}> {
    const awsSource = await awsSourcePromise
    const principal = await principalPromise
    const bucket = awsSource.bucket
    const path = principal + "/" + awsSource.object
    return {bucket: bucket, object: path}
}
