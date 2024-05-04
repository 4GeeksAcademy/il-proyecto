import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Modal, Button } from 'react-bootstrap';

export const DeleteAccount = () => {
    const { store, actions } = useContext(Context);
    const [reason, setReason] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const userDataString = sessionStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const userId = userData.id; 
        actions.deleteAccount(userId);
        navigate("/");
    };

    const [otherReason, setOtherReason] = useState("");

    const handleReasonChange = (e) => {
        setReason(e.target.value);
        // Reiniciar el motivo "Otro" cada vez que se cambia la selección
        if (e.target.value !== "Otro motivo") {
            setOtherReason("");
        }
    };

    return (
        <Container fluid className="container-landingpage vh-100">
            <Container>
            <Row className="mt-3">
                <Col>
                    <h1 className="heading1">Dar de baja</h1>
                    {store.user ? (
                        <Form onSubmit={handleSubmit}>
                            <Form.Select aria-label="Default select example" onChange={handleReasonChange}>

                                {/* <Form.Select aria-label="Default select example"> */}
                                <option>Selecciona una opción para eliminar tu cuenta: {store.user.email}</option>
                                <option value="Problemas para empezar">Problemas para empezar</option>
                                <option value="No tengo tiempo/me desconcentra">No tengo tiempo/me desconcentra</option>
                                <option value="He creado otra cuenta">He creado otra cuenta</option>
                                <option value="No encuentro con quién conectar">No encuentro con quién conectar</option>
                                <option value="Otro motivo">Otro motivo</option>
                            </Form.Select>
                            {/* Renderizar el TextArea si se selecciona "Otro motivo" */}
                            {reason === "Otro motivo" && (
                                <Form.Group controlId="exampleForm.ControlTextarea1" className="mb-3">
                                    <Form.Label>Escribe el motivo</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                    />
                                </Form.Group>
                            )}
                            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Introduce tu contraseña para confirmar</Form.Label>
                                <Form.Control type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
                            </Form.Group> */}
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
            </Container>
        </Container >
    );
};
