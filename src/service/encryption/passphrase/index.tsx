import React from 'react';
import { EncryptionContext } from "../../../api"
import { DecryptRequest, EncryptRequest, SetPassphraseRequest } from "./worker-api"

type ProviderProps = {
    children:React.ReactNode
}

const utf8Encode = new TextEncoder();
const promises = new Map<String, Promise<any>>()
const worker = new Worker(new URL("./worker.ts", import.meta.url));

export function PassphraseEncryptionProvider(props:ProviderProps) {
    const actions = {
        encrypt: (data:Uint8Array):Promise<Uint8Array> => {
            worker.postMessage({ uncryptedValue: utf8Encode.encode("alamakota") } as EncryptRequest)
            return Promise.resolve(data)
        },
        decrypt: (data:Uint8Array):Promise<Uint8Array> => {
            worker.postMessage({ encyptedValue: utf8Encode.encode("alamakota") } as DecryptRequest)
            return Promise.resolve(data)
        },
        usePassphrase: (passphrase:String):Promise<void> => {
            worker.postMessage({ passphrase: passphrase } as SetPassphraseRequest)
            return Promise.resolve()
        }
    }

    return (
<EncryptionContext.Provider value={{state: {loading: false}, actions: actions}}>
    {props.children}
</EncryptionContext.Provider>
    )
}
