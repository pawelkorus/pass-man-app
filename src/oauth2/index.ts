import { IssuerConfig, validateIssuerConfig, AuthorizationRequest, IdTokenResult, ErrorResult, validateType } from "./common"
import { authorizationCodeFlow } from "./authorizationCodeFlow"
import { implicitFlow } from "./implicitFlow"

export { IssuerConfig, validateIssuerConfig, validateType, AuthorizationRequest, IdTokenResult, ErrorResult } from "./common"

export type IssuerDiscoveryDocument = {
    issuer: string
    url: URL
}
function validateIssuerDiscoveryDocument(details:any):details is IssuerDiscoveryDocument {
    return validateType<IssuerDiscoveryDocument>(details, {
        issuer: "string",
        url: "string"
    })
}

export function wellKnownIssuerDiscoveryDocument(issuer:string):IssuerDiscoveryDocument {
    const discoverDocumentUrl = new URL(issuer)
    discoverDocumentUrl.pathname = discoverDocumentUrl.pathname + "/.well-known/openid-configuration"
    return {issuer: discoverDocumentUrl.origin, url: discoverDocumentUrl}
}

export interface IOIDCClient {
    authorizationCodeFlow: (request:AuthorizationRequest) => Promise<IdTokenResult | ErrorResult>

    implicitFlow: (request:AuthorizationRequest) => Promise<IdTokenResult | ErrorResult>
}

export class OIDCClient implements IOIDCClient {
    
    private issuerConfig:IssuerConfig

    constructor(issuerConfig:IssuerConfig) {
        this.issuerConfig = issuerConfig
    }

    public async authorizationCodeFlow(request: AuthorizationRequest):Promise<ErrorResult | IdTokenResult> {
        return authorizationCodeFlow(this.issuerConfig, request)
    }

    public async implicitFlow(request: AuthorizationRequest):Promise<IdTokenResult | ErrorResult> {
        return implicitFlow(this.issuerConfig, request)
    }

    get issuer() {
        return this.issuerConfig.issuer
    }
}

export async function createOIDCClient(issuerDetails:IssuerDiscoveryDocument | IssuerConfig | string):Promise<OIDCClient> {
    if(typeof issuerDetails === "string" || issuerDetails instanceof String) {
        const config = await loadOpenIdDiscoveryDocument(wellKnownIssuerDiscoveryDocument(issuerDetails as string))
        return new OIDCClient(config)
    } else if(validateIssuerDiscoveryDocument(issuerDetails)) {
        const config = await loadOpenIdDiscoveryDocument(issuerDetails)
        return new OIDCClient(config)
    } else {
        return new OIDCClient(issuerDetails)
    }
}

export async function loadOpenIdDiscoveryDocument(discoverDocumentDetails:IssuerDiscoveryDocument):Promise<IssuerConfig> {
    const response = await fetch(discoverDocumentDetails.url.toString())

    if(!response.ok) {
        return Promise.reject({
            message: "Error while fetching open id discovery document",
            statusCode: response.status,
        })
    }
    
    const responseBody = await response.json()
    if(!validateIssuerConfig(responseBody)) {
        return Promise.reject({
            message: "Invalid response schema",
            statusCode: response.status
        })
    }
    
    return Promise.resolve(responseBody)
}
