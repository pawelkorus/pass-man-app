import React from 'react';
import { EncryptionContext } from "../../api" 

type ProviderProps = {
    children:React.ReactNode
}

export function EncryptionProvider(props:ProviderProps) {
    const actions = {
        encrypt: (data:Uint8Array):Uint8Array => {
            return data
        },
        decrypt: (data:Uint8Array):Uint8Array => {
            return data
        },
        usePassphrase: (passphrase:String) => {
            console.info("use passphrase")
        }
    }

    return (
<EncryptionContext.Provider value={{state: {loading: true}, actions: actions}}>
    {props.children}
</EncryptionContext.Provider>
    )
}
