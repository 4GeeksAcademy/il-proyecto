// //import react into the bundle
// import React from "react";
// import ReactDOM from "react-dom";


// //import google login
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;  // Asegúrate de que esta variable de entorno está definida


// export const Google = () => (
// 	<GoogleOAuthProvider clientId={clientId}>
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     </GoogleOAuthProvider>

// );


import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;  // Verifica que esta variable de entorno esté definida

export const GoogleProvider = ({ children }) => (
    <GoogleOAuthProvider clientId={clientId}>
        {children}
    </GoogleOAuthProvider>
);