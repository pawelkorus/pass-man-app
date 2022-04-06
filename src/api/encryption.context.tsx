import React from 'react'

export type Encryptor = (data:Uint8Array) => Uint8Array
export type Decryptor = (data:Uint8Array) => Uint8Array

export type EncryptionContextProps = {
    state: {
        loading:boolean
    },
    actions: {
        encrypt: Encryptor
        decrypt: Decryptor
        usePassphrase: (passphrase:String) => void
    }
}

export const EncryptionContext = React.createContext<EncryptionContextProps>({
    state: {
        loading: false
    },
    actions: {
        encrypt: (data) => {
            console.debug("encrypt data")
            return data
        },
        decrypt: (data) => {
            console.debug("decrypt data")
            return data
        },
        usePassphrase: (passphrase:String) => {
            console.debug("set passphrase " + passphrase)
        }
    }
})

export function useEncryption() {
    return React.useContext(EncryptionContext)
}


