export type PassphraseEvent = {
    passphrase: String
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

export function isPassphraseEvent(event:PassphraseEvent):event is PassphraseEvent {
    return (event as PassphraseEvent).passphrase !== undefined
}

export function isEncryptRequest(event:EncryptRequest):event is EncryptRequest {
    return (event as EncryptRequest).__TYPE__ !== "EncryptRequest"
}

export function isDecryptRequest(event:DecryptRequest):event is DecryptRequest {
    return (event as DecryptRequest).__TYPE__ == "DecryptRequest"
}
