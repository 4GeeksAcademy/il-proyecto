import React from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { BackendURL } from "./component/backendURL";
import { useNavigate } from "react-router-dom";

import { Home } from "./pages/home";
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
import { ChooseMood } from "./pages/choose-mood";
import { UserProfile } from "./pages/userProfile";
import { Resources } from "./pages/resources";
import { DayMood } from "./pages/day-mood";
import { Chat } from "./pages/chat";



function PrivateRoute({ children }) {
    const navigate = useNavigate();
    const authToken = sessionStorage.getItem('userToken'); 
    const isAuthenticated = authToken !== null;

    if (!isAuthenticated) {
        return navigate("/login");
    }
    return children;
    }

    

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
                        <Route element={<Login />} path="/login" />
                        <Route element={<Faqs />} path="/faqs" />
                        <Route element={<Legal />} path="/legal" />                    
                        <Route element={<SignUp />} path="/singup" />
                        <Route element={<DeleteAccount />} path="/delete-account" />
                        <Route element={<ResetPassword />} path="/reset-password" />
                        <Route element={<PrivateRoute><ChooseMood /></PrivateRoute>} path="/choose-mood" />
                        <Route element={<PrivateRoute><Geolocation /></PrivateRoute>} path="/geolocation"/>
                        <Route element={<PrivateRoute><UserProfile /></PrivateRoute>} path="/:uid/:url"/>
                        <Route element={<PrivateRoute><Resources /></PrivateRoute>} path="/resources"/> 
                        <Route element={<PrivateRoute><DayMood /></PrivateRoute>} path="/day-mood"/>  
                        <Route element={<PrivateRoute><Chat /></PrivateRoute>} path="/chat-v1" />                                   
                    </Routes>
                    <Footer />            
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);