import AWS from 'aws-sdk/global';

export interface Config {
    cognito?: CognitoOptions,
    source: AWSSource
}
export interface CognitoOptions {
    identityPoolId:string,
    clientId:string
}

interface OAuthProviders {
    google:OAuthClient
}

interface OAuthClient {
    clientId: string;
}

type AWSSource = {
    bucket: string
    object: string
    endpoint?: string
}