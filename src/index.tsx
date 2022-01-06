import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ConfigProvider } from './service'
import { S3RealmsProvider } from './aws'
import { IdentityPoolAuthProvider, AuthenticationCodeAuthProvider } from './aws'

ReactDOM.render(
<ConfigProvider> 
    <AuthenticationCodeAuthProvider>
        <S3RealmsProvider>
            <App/>
        </S3RealmsProvider> 
    </AuthenticationCodeAuthProvider>
</ConfigProvider>, 
    document.querySelector('#root'));
