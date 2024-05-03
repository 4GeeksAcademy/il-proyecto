
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Form } from 'react-bootstrap';

export const SignUp = () => {

	const { actions } = useContext(Context);
	const [name, setName] = useState("");
	const [surnames, setSurnames] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [copyPassword, setCopyPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== copyPassword) {
			setError("Las contraseñas no coinciden.");
			return;
		}
		const result = await actions.signUp(name, surnames, email, password);
        if (result.status) {
            console.log(result.msg);
            navigate("/login");
        } else {
            setError(result.msg);
        }
	};
	return (
		<Container fluid className="container-landingpage">
			<Row className="mt-3">
				<Col>
					<h1 className="heading1">Registro MyMood</h1>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formBasicName">
							<Form.Label>Nombre</Form.Label>
							<Form.Control type="text" placeholder="¿Cómo te llamas?" onChange={e => setName(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicSurnames">
							<Form.Label>Apellidos</Form.Label>
							<Form.Control type="text" placeholder="Dinos tus apellidos" onChange={e => setSurnames(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" placeholder="Introduce el email con el que vas a crear la cuenta" onChange={e => setEmail(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword1">
							<Form.Label>Contraseña</Form.Label>
							<Form.Control type="password" placeholder="Introduce tu contraseña" onChange={e => setPassword(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword2">
							<Form.Label>Valida tu contraseña</Form.Label>
							<Form.Control type="password" placeholder="Repite la contraseña" onChange={e => setCopyPassword(e.target.value)} />
						</Form.Group>
						<button type="submit" className="button1 form-button">¡Crear cuenta!</button>
					</Form>
					{error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
				</Col>
			</Row>
		</Container >
	);
};

