export const fetchConfig = async():Promise<Config> => {
    let response = await fetch("/config.json")
    return response.json()
}

export interface Config {
    cognito?: CognitoOptions,
    clientIdSecret?: Credentials,
    source: AWSSource
}

export interface CognitoOptions {
    identityPoolId:string,
    clientId:string
}

export interface OAuthProviders {
    google:OAuthClient
}

export interface OAuthClient {
    clientId: string;
}

export type AWSSource = {
    bucket: string
    object: string
    endpoint?: string
    region?:string
}

export type Credentials = {
    clientId: string
    clientSecret: string
}
