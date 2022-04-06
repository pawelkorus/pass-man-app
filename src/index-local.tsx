import './main.scss';
import React from 'react';
import { createRoot } from "react-dom/client"

import App from './App';
import { ConfigProvider } from './service'
import { S3RealmsProvider, ClientCredentialsAuthProvider } from './aws'
import { PassphraseInputWithEnryption } from './ui';

const root = createRoot(document.querySelector("#root"))
root.render(
<ConfigProvider> 
    <ClientCredentialsAuthProvider>
        <PassphraseInputWithEnryption>
            <S3RealmsProvider>
                <App/>
            </S3RealmsProvider> 
        </PassphraseInputWithEnryption>
    </ClientCredentialsAuthProvider>
</ConfigProvider>)
