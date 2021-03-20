import Papa from 'papaparse'
import AWSBackend from './AWSBackend'

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
    id: string
}

type AWSSource = {
    bucket: string,
    object: string
}

/*export const fetchRealms = function(url:string):Promise<RealmDefinition[]> {
    return fetch(url)
        .then(response => response.text())
        .then(textValue => Papa.parse<RealmDefinition>(textValue, { header: true, transform: transform }).data)
}

export const pushRealms = function(realms:RealmDefinition[]):Promise<RealmDefinition[]> {
    console.log(realms);
    return Promise.resolve(realms);
}*/

export const setupRealms = function(source:AWSSource) {
    resolveBackend(new AWSBackend())
    resolveSource(source)
}

export const fetchRealms = async () => {
    let awsBackend = await awsBackendPromise
    let source = await awsSourcePromise
    let value = await awsBackend.fetchResource(source.bucket, source.object)
    return Papa.parse<RealmDefinition>(value, { header: true, transform: transform }).data
}

export const pushRealms = async (realms:RealmDefinition[]) => {
    let awsBackend = await awsBackendPromise
    let awsSource = await awsSourcePromise
    await awsBackend.storeResource(awsSource.bucket, awsSource.object, Papa.unparse(realms))
    return realms
}

function transform(value:string, headerName:string) {
    if(headerName == "tags") {
        return value.split(",");
    }
    return value;
}