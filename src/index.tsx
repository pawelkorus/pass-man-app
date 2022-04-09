import './main.scss';
import React from 'react';
import { createRoot } from "react-dom/client"

import App from './App';
import { ConfigProvider } from './service'
import { S3RealmsProvider } from './aws'
import { IdentityPoolAuthProvider } from './aws'

const root = createRoot(document.querySelector("#root"))
root.render(
<ConfigProvider> 
    <IdentityPoolAuthProvider>
        <S3RealmsProvider>
            <App/>
        </S3RealmsProvider> 
    </IdentityPoolAuthProvider>
</ConfigProvider>)
