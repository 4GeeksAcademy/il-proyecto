import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await actions.requestPasswordReset(email);
        setMessage(result.message);
        if (result.success) {
            // Handle success (e.g., navigating to another route or clearing the form)
            console.log('super!!!!!');
            navigate("/");
        }
    };

    return (
        <>
            <Container fluid className="container-landingpage">
                <h1 className="heading1">Quiero recuperar mi contraseña</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="button1 form-button">Envíame el enlace</button>
                </Form>
                {message && <div className="text-danger mt-3 border border-danger p-3">{message}</div>}
            </Container>
        </>

    );
};

export default PasswordResetRequest;
