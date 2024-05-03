import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useLocation } from 'react-router-dom';

import { Container, Row, Col, Form } from 'react-bootstrap';


const ResetPassword = () => {
    const { actions } = useContext(Context);
    const [password, setPassword] = useState('');
    const [copyPassword, setCopyPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== copyPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            const response = await actions.resetPassword(token, password);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Hubo un error al restablecer la contraseña');
            }
            setSuccessMessage('¡Contraseña restablecida con éxito!');
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <>
            <Container fluid className="container-landingpage">
                <Row className="mt-3">
                    <Col>
                        <h1 className="heading1">Resetear contraseña</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicPassword1">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Introduce tu contraseña" onChange={e => setPassword(e.target.value)} value={password} autoComplete="new-password" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword2">
                                <Form.Label>Valida tu contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Repite la contraseña" onChange={e => setCopyPassword(e.target.value)} value={copyPassword} autoComplete="new-password" />
                            </Form.Group>
                            <button type="submit" className="button1 form-button">Cambiar contraseña</button>
                        </Form>
                        {error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
                        {successMessage && <div className="text-success mt-3 border border-success p-3">{successMessage}</div>}
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default ResetPassword;



{/* <Container fluid className="container-landingpage">
                <Row className="mt-3">
                    <Col>
                        <h1 className="heading1">Resetear contraseña</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicPassword1">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Introduce tu contraseña" onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword2">
                                <Form.Label>Valida tu contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Repite la contraseña" onChange={e => setCopyPassword(e.target.value)} />
                            </Form.Group>
                            <button type="submit" className="button1 form-button">Cambiar contraseña</button>
                        </Form>
                        {error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
                    </Col>
                </Row>
            </Container > */}
