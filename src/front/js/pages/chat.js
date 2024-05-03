
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import Container from 'react-bootstrap/Container';
import ChatForm from "../component/chatform";


export const Chat = () => {
    const { actions } = useContext(Context);

    return (
        <>

            <Container fluid className="container-landingpage vh-100">                           
                    <h1>Chat</h1>
                    <ChatForm />                  
            </Container >
        </>
    );
};

