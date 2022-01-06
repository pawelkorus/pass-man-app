import { Config } from '../../api'
import { IdentityPoolAuthConfig } from './common'

export function isIdentityPoolAuthConfig(config:Config):config is IdentityPoolAuthConfig {
    const identityPoolProperties = (config as IdentityPoolAuthConfig)?.cognito
    return identityPoolProperties?.identityPoolId !== undefined 
        && identityPoolProperties?.region !== undefined 
        && identityPoolProperties?.provider?.name !== undefined
        && identityPoolProperties?.provider?.authorizeEndpoint !== undefined
        && identityPoolProperties?.provider?.clientId !== undefined
        && identityPoolProperties?.provider?.responseType !== undefined
        && identityPoolProperties?.provider?.scope !== undefined
}

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
