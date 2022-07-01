import React from 'react';
import { render } from "@testing-library/react";
import { PassphraseEncryptionProvider } from "../../../src/service/encryption/passphrase"

it('Passphrase is set', () => {
    
})

function customRender(ui:React.ReactElement, providerProps:any, ...renderOptions:any) {
    return render(
        <PassphraseEncryptionProvider {...providerProps}>{ui}</PassphraseEncryptionProvider>,
        renderOptions
    )
}
