import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { Credentials, Provider } from "@aws-sdk/types";

type FragmentParams = { 
    [name: string]: string
};

export type ClientIdSecretProperties = {
    clientId: string
    clientSecret: string
}

export type IdentityPoolProperties = {
    identityPoolId:string,
    clientId:string
}

export async function authenticateClientIdClientSecret(credentials:ClientIdSecretProperties):Promise<Provider<Credentials>> {  
    const prov:Provider<Credentials> = () => new Promise<Credentials>(resolve => {
                resolve({
                    accessKeyId: credentials.clientId,
                    secretAccessKey: credentials.clientSecret
                })
            })
    
    return new Promise(resolve => {
        resolve(prov)
    })
}

export const authenticateCognito = function(options:IdentityPoolProperties):Promise<Provider<Credentials>> {
    const fragmentString = window.location.hash.substring(1);
    const fragmentParams:FragmentParams = {}

    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(fragmentString))) {
        fragmentParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    const preservedState = window.sessionStorage.getItem('cognito_state');

    if(fragmentParams["id_token"] && fragmentParams["state"] == preservedState) {
    
        window.location.hash = "";
        return Promise.resolve(fromCognitoIdentityPool({
            identityPoolId: options.identityPoolId,
            logins: { // optional tokens, used for authenticated login
                // 'graph.facebook.com': 'FBTOKEN',
                // 'www.amazon.com': 'AMAZONTOKEN',
                'accounts.google.com': fragmentParams['id_token']
            },
            clientConfig: {
                region: 'eu-central-1'
            }
        }))

    } else {
        
        const state = secureRandomString();
        window.sessionStorage.setItem('cognito_state', state);

        const authRequestParams = { 
            response_type: 'token id_token',
            client_id: options.clientId,
            redirect_uri: window.location.origin,
            scope: 'openid profile',
            state: state,
            nonce: ''+secureRandomNumber()
        }
        
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams(authRequestParams).toString();

        return new Promise(() => {
            // never resolve -> redirecting
        })
    }
}

function secureRandomNumber() {
    const array = new Uint32Array(1);
    return window.crypto.getRandomValues(array);
}

function secureRandomString():string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}
