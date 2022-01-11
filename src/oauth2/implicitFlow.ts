import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose"
import { IssuerConfig, AuthorizationRequest, IdTokenResult, ErrorResult, secureRandomNumber, secureRandomString, 
    ofIdTokenResult, ofRFCErrorResult, ofUndefinedErrorResult, isSet, isNotSet, validateRFCError, IdToken } from "./common"

type FragmentParams = { 
    [name: string]: string
};

export async function implicitFlow(issuerDetails:IssuerConfig, authorizationRequest:AuthorizationRequest): Promise<IdTokenResult | ErrorResult> {
    const fragmentString = window.location.hash.substring(1);
    const fragmentParams:FragmentParams = {}

    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(fragmentString))) {
        fragmentParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    const idToken = fragmentParams["id_token"]
    const accessToken = fragmentParams["access_token"]
    const state = fragmentParams["state"]
    const error = fragmentParams["error"]

    const preservedState = window.sessionStorage.getItem('cognito_state');

    if(isNotSet(error) && isSet(idToken) && isSet(accessToken) && isSet(state) && state == preservedState) {
        const JWKS = createRemoteJWKSet(new URL(issuerDetails.jwks_uri))

        const { payload } = await jwtVerify(idToken, JWKS, {
            issuer: issuerDetails.issuer,
            audience: authorizationRequest.clientId
        })
        
        await jwtVerify(accessToken, JWKS, {
            issuer: issuerDetails.issuer,
        })

        return Promise.resolve(ofIdTokenResult(toIdToken(payload, idToken), accessToken))
    } else if(isSet(error) && validateRFCError(error) && isSet(state) && state == preservedState) {
        return Promise.resolve(ofRFCErrorResult(error)) 
    } else if(isSet(error) && !validateRFCError(error) && isSet(state) && state == preservedState) {
        return Promise.resolve(ofUndefinedErrorResult(error))
    } else if(isSet(state) && state != preservedState) {
        return Promise.resolve(ofUndefinedErrorResult("state_doesnt_match"))
    } else {
        const state = secureRandomString();
        window.sessionStorage.setItem('cognito_state', state);

        const authRequestParams = { 
            response_type: "token",
            client_id: authorizationRequest.clientId,
            redirect_uri: authorizationRequest.redirectUri,
            scope: authorizationRequest.scope,
            state: state,
            nonce: ''+secureRandomNumber()
        }
        
        window.location.href = issuerDetails.token_endpoint + "?" + new URLSearchParams(authRequestParams).toString();

        return Promise.reject("Redirecting browser")
    }
}

function toIdToken(payload:JWTPayload, rawToken:string):IdToken {
    return {
        ...{ rawToken: rawToken }, ...payload
    }
}
