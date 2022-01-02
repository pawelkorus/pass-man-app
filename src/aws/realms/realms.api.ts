import Papa from "papaparse"
import AWSBackend from "./AWSBackend"
import { Credentials, Provider } from "@aws-sdk/types";
import { RealmDefinition } from "../../api"

let resolveBackend:(backend:AWSBackend) => void
let resolveSource:(source:S3RealmsProperties) => void

const awsBackendPromise = new Promise<AWSBackend>(resolve => {
    resolveBackend = resolve
})

const awsSourcePromise = new Promise<S3RealmsProperties>(resolve => {
    resolveSource = resolve
})


export type S3RealmsProperties = {
    bucket: string
    object: string
    endpoint?: string
    region?:string
}

export const setupRealms = (source:S3RealmsProperties, credentials:Credentials) => {
    resolveBackend(new AWSBackend(source, credentials))
    resolveSource(source)
}

export const fetchRealms = async () => {
    const awsBackend = await awsBackendPromise
    const source = await awsSourcePromise
    const value = await awsBackend.fetchResource(source.bucket, source.object)
    const realms = Papa.parse<RealmDefinition>(value, { header: true, transform: transform }).data
    realms?.forEach(realm => realm.persisted = true)
    return realms
}

export const pushRealms = async (realms:RealmDefinition[]) => {
    const awsBackend = await awsBackendPromise
    const awsSource = await awsSourcePromise
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
