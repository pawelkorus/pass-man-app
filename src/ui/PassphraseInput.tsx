import React, { FormEvent, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useEncryption } from '../api';
import { EncryptionProvider } from "../service"

type Props = {
    children: React.ReactNode
}

export function PassphraseInput(props:Props):JSX.Element {
    const [showForm, setShowForm] = useState(true)
    const encryptionContext = useEncryption()
    const passphraseInput = useRef<HTMLInputElement>()

    function handleSubmit(e:FormEvent) {
        e.preventDefault()
        encryptionContext.actions.usePassphrase(passphraseInput.current.value)
        setShowForm(false)
    }

    return (
<Container>
    {showForm?
    <form onSubmit={handleSubmit}>
        <input type="password" ref={passphraseInput}/>
        <input type="submit" value="submit"/>
    </form> 
    : props.children
    }
</Container>
    )
}

export function PassphraseInputWithEnryption(props:Props):JSX.Element {
    return (
<EncryptionProvider>
    <PassphraseInput>
        {props.children}
    </PassphraseInput>
</EncryptionProvider>
    )
}
