import React from 'react'

export type Encryptor = (data:Uint8Array) => Promise<Uint8Array>
export type Decryptor = (data:Uint8Array) => Promise<Uint8Array>

export type EncryptionContextProps = {
    state: {
        loading:boolean
    },
    actions: {
        encrypt: Encryptor
        decrypt: Decryptor
        usePassphrase: (passphrase:String) => Promise<void>
    }
}

export const EncryptionContext = React.createContext<EncryptionContextProps>({
    state: {
        loading: false
    },
    actions: {
        encrypt: (data) => {
            console.debug("encrypt data")
            return Promise.resolve(data)
        },
        decrypt: (data) => {
            console.debug("decrypt data")
            return Promise.resolve(data)
        },
        usePassphrase: (passphrase:String) => {
            console.debug("set passphrase " + passphrase)
            return Promise.resolve()
        }
    }
})

export function useEncryption() {
    return React.useContext(EncryptionContext)
}


