
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleProvider } from "../component/google";  // Asegúrate de que la ruta de importación es correcta

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ChatForm from "../component/chatform";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';


export const Chat = () => {
    const { actions } = useContext(Context);

    return (
        <>

            <Container fluid className="container-landingpage vh-100">
                <Row className="mt-3">
                    <Col>
                        <h1>Chat</h1>
                        <ChatForm />
                    </Col>
                </Row>

            </Container >
        </>
    );
};

