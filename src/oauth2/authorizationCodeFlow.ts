import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose"
import { secureRandomString, generateCodeChallengeFromVerifier, IssuerConfig, AuthorizationRequest, ofIdTokenResult, 
    ofRFCErrorResult, ofUndefinedErrorResult, IdTokenResult, ErrorResult, validateRFCError, isSet, isNotSet, IdToken } from "./common"

export async function authorizationCodeFlow(issuerDetails:IssuerConfig, authorizationRequest:AuthorizationRequest): Promise<IdTokenResult | ErrorResult> {
    const queryParams = new URLSearchParams(window.location.search)
    const preservedState = window.sessionStorage.getItem("oauth2_state");
    const code = queryParams.get("code")
    const state = queryParams.get("state")
    const error = queryParams.get("error")
    const codeVerifier = window.sessionStorage.getItem("oauth2_code_verifier")

    history.replaceState(null, null, '/')

    if(isSet(code) && isSet(state) && state == preservedState && isSet(codeVerifier)) {
        const bodyParams = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: authorizationRequest.clientId,
            code: code,
            redirect_uri: window.location.origin,
            code_verifier: codeVerifier
        })

        const response = await fetch(issuerDetails.token_endpoint.toString(), {
            method: "POST",
            body: bodyParams.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" 
            }              
        })

        if(!response.ok) {
            return Promise.resolve(ofUndefinedErrorResult("token_request_failed"))
        }

        const responseBody = await response.json()
        if(isNotSet(responseBody.id_token) || isNotSet("access_token")) {
            return Promise.resolve(ofUndefinedErrorResult("invalid_token_endpoint_response"))
        }
        const idToken = responseBody.id_token as string
        const accessToken = responseBody.access_token as string
    
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
        window.sessionStorage.setItem("oauth2_state", state);
        
        const codeVerifier = secureRandomString();
        window.sessionStorage.setItem("oauth2_code_verifier", codeVerifier)
        
        const {codeChallenge, codeChallengeMethod} = await generateCodeChallengeFromVerifier(codeVerifier)

        const authRequestParams = { 
            response_type: "code",
            client_id: authorizationRequest.clientId,
            redirect_uri: window.location.origin,
            scope: authorizationRequest.scope,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
        }
        
        window.location.href = issuerDetails.authorization_endpoint + "?" + new URLSearchParams(authRequestParams).toString();

        return Promise.reject("Redirecting browser")
    }
}

function toIdToken(payload:JWTPayload, rawToken:string):IdToken {
    return {
        ...{ rawToken: rawToken }, ...payload
    }
}
