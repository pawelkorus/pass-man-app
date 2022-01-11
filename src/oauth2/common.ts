export function secureRandomNumber() {
    const array = new Uint32Array(1);
    return window.crypto.getRandomValues(array);
}

export function secureRandomString():string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}

export function sha256(plain:string):Promise<ArrayBuffer> {
    // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
}

export function base64urlencode(a:ArrayBuffer) {
    var str = "";
    var bytes = new Uint8Array(a);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
}

export async function generateCodeChallengeFromVerifier(v:string) {
    var hashed = await sha256(v);
    var base64encoded = base64urlencode(hashed);
    return {
        codeChallenge: base64encoded,
        codeChallengeMethod: "S256"
    }
}

export type IssuerConfig = {
    issuer: string
    authorization_endpoint: string
    jwks_uri: string
    response_types_supported: string[]
    scopes_supported: string[]
    token_endpoint: string
    userinfo_endpoint: string
}
export function validateIssuerConfig(data:any): data is IssuerConfig {    
    return validateType<IssuerConfig>(data, {
        issuer: "string",
        authorization_endpoint: "string",
        jwks_uri: "string",
        response_types_supported: "array",
        scopes_supported: "array",
        token_endpoint: "string",
        userinfo_endpoint: "string"
    })
}

export function validateType<T>(data:any, schema:Record<keyof T, string>, ): data is T {  
    const missingProperties = Object.keys(schema)
        .filter(key => data[key] === undefined)
        .map(key => key as keyof T)
        .map(key => new Error(`Document is missing ${key} ${schema[key]}`));

    return missingProperties.length == 0
}

export type ClientDetals = {
    clientId: string
    redirectUri: string
}

export type AuthorizationRequest = ClientDetals & {
    scope: string
}

export type AccessTokenResult = {result: "success", accessToken: string}

export type IdToken = {
    rawToken: string,
    sub?: string,
    [claim:string]:unknown
}

export type IdTokenResult = AccessTokenResult & {idToken: IdToken}
export function ofIdTokenResult(idToken:IdToken, accessToken:string):IdTokenResult {
    return {result: "success", 
        idToken: idToken,
        accessToken: accessToken
    } as IdTokenResult
}

export type ErrorResult = {result: "fail", reason:RFCError | string}
export function ofRFCErrorResult(reason:RFCError) {
    return {result: "fail", reason: reason} as ErrorResult
}
export function ofUndefinedErrorResult(reason:string) {
    return {result: "fail", reason: reason} as ErrorResult
}

const rfcErrors = ["invalid_request", "unauthorized_client", "access_denied",
    "unsupported_response_type", "invalid_scope", "server_error",
    "temporarily_unavailable"] as const
export type RFCError = (typeof rfcErrors)[number]
export function validateRFCError(input:string): input is RFCError {
    return (rfcErrors as readonly string[]).includes(input)
}

export function isSet(v:any) {
    return v !== undefined && v !== null
}

export function isNotSet(v:any) {
    return v === undefined || v === null
}
