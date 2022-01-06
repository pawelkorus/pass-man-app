import { Config } from '../../api'

export type IdentityPoolAuthConfig = Config & {
    cognito: IdentityPoolProperties
}

export type IdentityPoolProperties = {
    identityPoolId:string,
    region: string,
    provider: ImplicitProviderProperties | AuthorizationCodeProviderProperties
}

export type CommonProviderProperties = {
    name: string,
    authorizeEndpoint: string,
    clientId:string,
    scope: string
}

export type ImplicitProviderProperties = CommonProviderProperties & {
    responseType: "token"
}

export type AuthorizationCodeProviderProperties = CommonProviderProperties & {
    responseType: "code",
    tokenEndpoint: string
}

export function validateAuthorizationCodeProviderProperties(properties: ImplicitProviderProperties | AuthorizationCodeProviderProperties): properties is AuthorizationCodeProviderProperties {
    const authorizationCodeProviderProperties = properties as AuthorizationCodeProviderProperties
    return authorizationCodeProviderProperties.tokenEndpoint != undefined && authorizationCodeProviderProperties.responseType === "code"
}
