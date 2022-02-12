// import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ConfigProvider } from './service'
import { S3RealmsProvider } from './aws'
import { IdentityPoolAuthProvider } from './aws'

ReactDOM.render(
<ConfigProvider> 
    <IdentityPoolAuthProvider>
        <S3RealmsProvider>
            <App/>
        </S3RealmsProvider> 
    </IdentityPoolAuthProvider>
</ConfigProvider>, 
    document.querySelector('#root'));
