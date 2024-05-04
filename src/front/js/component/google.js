import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;  // Verifica que esta variable de entorno esté definida

export const GoogleProvider = ({ children }) => (
    <GoogleOAuthProvider clientId={clientId}>
        {children}
    </GoogleOAuthProvider>
);