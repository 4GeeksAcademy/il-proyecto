import React from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Login } from "./pages/login";
import { Geolocation } from "./pages/geolocation";

import injectContext from "./store/appContext";
import { MainNavbar } from "./component/mainNavbar";
import { Footer } from "./component/footer";
import { Faqs } from "./pages/faqs";
import { Legal } from "./pages/legal";
import  ResetPassword  from "./component/resetPassword";
import { SignUp } from "./pages/singup";
import { DeleteAccount } from "./pages/deleteAccount";
import { ChooseMood } from "./pages/chooseMood";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="main-content">
            <BrowserRouter basename={basename}>                              
                    <MainNavbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Faqs />} path="/faqs" />
                        <Route element={<Legal />} path="/legal" />
¡                       <Route element={<ResetPassword />} path="/reset-password" />
                        <Route element={<SignUp />} path="/singup" />
                        <Route element={<DeleteAccount />} path="/delete-account" />
                        <Route element={<ChooseMood />} path="/chooseMood" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Geolocation />} path="/geolocation"/>
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />            
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);