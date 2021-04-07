import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// context imports
import AuthContextProvider from './contexts/AuthContextProvider';

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
