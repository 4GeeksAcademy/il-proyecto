import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

export const DeleteAccount = () => {
    const { store, actions } = useContext(Context);
    const [reason, setReason] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Lógica para enviar el formulario y eliminar la cuenta
        try {
            let response = await fetch('/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason, password })
            });
            if (response.ok) {
                navigate("/"); // Redirigir al usuario a la página de inicio después de eliminar la cuenta
            } else {
                let data = await response.json();
                setError(data.error);
            }
        } catch (error) {
            setError("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    return (
        <Container fluid className="container-landingpage">
            <Row className="mt-3">
                <Col>
					<h1 className="heading1">Dar de baja</h1>
                    {!store.user ? (
                        <Form onSubmit={handleSubmit}>
                            <Form.Select aria-label="Default select example mb-3 border border-dark" onChange={e => setReason(e.target.value)}>
                                <option>Selecciona una opción para eliminar tu cuenta</option>
                                <option value="Problemas para empezar">Problemas para empezar</option>
                                <option value="No tengo tiempo/me desconcentra">No tengo tiempo/me desconcentra</option>
                                <option value="He creado otra cuenta">He creado otra cuenta</option>
                                <option value="No encuentro con quién conectar">No encuentro con quién conectar</option>
                                <option value="Otro motivo">Otro motivo</option>
                            </Form.Select>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Introduce tu contraseña para confirmar</Form.Label>
                                <Form.Control type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
                            <button type="submit" className="button1 form-button mb-3">Eliminar cuenta</button>
                            {error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
                        </Form>
                    ) : (
                        <div>
                            <p>Para eliminar la cuenta sigue estos pasos:</p>
                            <ol>
                                <li>Ve a la página Eliminar la cuenta. Si no has iniciado sesión, se te pedirá que primero lo hagas.</li>
                                <li>Selecciona una opción del menú desplegable junto a ¿Por qué quieres eliminar tu cuenta? y vuelve a introducir la contraseña.</li>
                                <li>Haz clic en el botón para eliminar tu cuenta.</li>
                            </ol>
                        </div>
                    )}
                </Col>
            </Row>
        </Container >
    );
};
