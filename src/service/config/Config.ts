export default interface Config {
    identityPool:string

    oauth:OAuthProviders

    source: AWSSource
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
}