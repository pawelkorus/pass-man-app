import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ConfigProvider } from './context/config.context'
import { ConfigContext } from './context/config.context'
import { AuthContext, AuthProvider } from './context/auth.context'

ReactDOM.render(
<ConfigProvider> 
    <AuthProvider>
        <App/> 
    </AuthProvider>
</ConfigProvider>, 
    document.querySelector('#root'));
