import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ConfigProvider } from './context/config.context'
import { ConfigContext } from './context/config.context'
import { AuthContext, AuthProvider } from './context/auth.context'
import S3RealmsProvider from './aws'

ReactDOM.render(
<ConfigProvider> 
    <AuthProvider>
        <S3RealmsProvider>
            <App/>
        </S3RealmsProvider> 
    </AuthProvider>
</ConfigProvider>, 
    document.querySelector('#root'));
