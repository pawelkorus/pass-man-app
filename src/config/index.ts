export const fetchConfig = async() => {
    let response = await fetch("/config.json")
    return response.json()
}

export interface Config {
    cognito?: CognitoOptions,
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
    credentials?: Credentials
}

export type Credentials = {
    clientId: string
    clientSecret: string
}