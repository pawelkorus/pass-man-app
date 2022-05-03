export type ErrorResponse = {
    __TYPE__: "ErrorResponse"
    name: String
    message: String
}

export type SetPassphraseRequest = {
    __TYPE__: "SetPassphraseRequest"
    passphrase: String
}

export type SetPassphraseResponse = {
    __TYPE__: "SetPassphraseResponse"
}

export type EncryptRequest = {
    __TYPE__: "EncryptRequest"
    uncryptedValue: Uint8Array
}

export type EncryptResponse = {
    __TYPE__: "EncryptResponse"
    encyptedValue: Uint8Array
}

export type DecryptRequest = {
    __TYPE__: "DecryptRequest"
    encyptedValue: Uint8Array
}

export type DecryptResponse = {
    __TYPE__: "DecryptResponse"
    decryptedValue: Uint8Array
}

export function isErrorResponse(event:ErrorResponse):event is ErrorResponse {
    return event.__TYPE__ === "ErrorResponse"
}

export function isSetPassphraseRequest(event:SetPassphraseRequest):event is SetPassphraseRequest {
    return event.__TYPE__ === "SetPassphraseRequest"
}

export function isSetPassphraseResponse(event:SetPassphraseResponse):event is SetPassphraseResponse {
    return event.__TYPE__ === "SetPassphraseResponse"
}

export function isEncryptRequest(event:EncryptRequest):event is EncryptRequest {
    return event.__TYPE__ === "EncryptRequest"
}

export function isEncryptResponse(event:EncryptResponse):event is EncryptResponse {
    return event.__TYPE__ === "EncryptResponse"
}

export function isDecryptRequest(event:DecryptRequest):event is DecryptRequest {
    return event.__TYPE__ === "DecryptRequest"
}

export function isDecryptResponse(event:DecryptResponse):event is DecryptResponse {
    return event.__TYPE__ === "DecryptResponse"
}
