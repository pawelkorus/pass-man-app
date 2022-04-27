import React from 'react';
import { EncryptionContext } from "../../../api"
import { PassphraseEvent } from "./worker-api"

type ProviderProps = {
    children:React.ReactNode
}

const promises = new Map<String, Promise<any>>()
const worker = new Worker(new URL("./worker.ts", import.meta.url));

export function EncryptionProvider(props:ProviderProps) {
    const actions = {
        encrypt: (data:Uint8Array):Promise<Uint8Array> => {
            return Promise.resolve(data)
        },
        decrypt: (data:Uint8Array):Promise<Uint8Array> => {
            return Promise.resolve(data)
        },
        usePassphrase: (passphrase:String):Promise<void> => {
            worker.postMessage({ passphrase: passphrase } as PassphraseEvent)
            return Promise.resolve()
        }
    }

    return (
<EncryptionContext.Provider value={{state: {loading: true}, actions: actions}}>
    {props.children}
</EncryptionContext.Provider>
    )
}
