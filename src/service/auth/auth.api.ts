//import AWS from 'aws-sdk/global';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { Credentials, Provider } from "@aws-sdk/types";
import { CognitoOptions, Credentials as Creds } from "../../config"

type FragmentParams = { 
    [name: string]: string
};

export async function authenticateClientIdClientSecret(credentials:Creds):Promise<Provider<Credentials>> {  
    const prov:Provider<Credentials> = () => new Promise<Credentials>((resolve, reject) => {
                resolve({
                    accessKeyId: credentials.clientId,
                    secretAccessKey: credentials.clientSecret
                })
            })
    
    return new Promise((resolve, reject) => {
        resolve(prov)
    })
}

export const authenticateCognito = function(options:CognitoOptions):Promise<Provider<Credentials>> {
    const fragmentString = window.location.hash.substring(1);
    let fragmentParams:FragmentParams = {}

    let regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        fragmentParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    let preservedState = window.sessionStorage.getItem('cognito_state');

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
        
        let state = secureRandomString();
        window.sessionStorage.setItem('cognito_state', state);

        let authRequestParams = { 
            response_type: 'token id_token',
            client_id: options.clientId,
            redirect_uri: window.location.origin,
            scope: 'openid profile',
            state: state,
            nonce: ''+secureRandomNumber()
        }
        
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams(authRequestParams).toString();

        return new Promise((resolve, reject) => {
            // never resolve -> redirecting
        })
    }
}

function secureRandomNumber() {
    var array = new Uint32Array(1);
    return window.crypto.getRandomValues(array);
}

function secureRandomString():string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}
