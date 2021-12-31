import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ConfigProvider } from './service'
import { S3RealmsProvider, ClientCredentialsAuthProvider } from './aws'

ReactDOM.render(
<ConfigProvider> 
    <ClientCredentialsAuthProvider>
        <S3RealmsProvider>
            <App/>
        </S3RealmsProvider> 
    </ClientCredentialsAuthProvider>
</ConfigProvider>, 
    document.querySelector('#root'));
