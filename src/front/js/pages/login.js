
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleProvider } from "../component/google";  // Asegúrate de que la ruta de importación es correcta

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Login = () => {
	const { actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		let logged = await actions.login(email, password);
		if (logged) {
			navigate("/");
		} else {
			setError("Failed to log in. Please check your email and password.");
		}
	};

	const handleGoogleSuccess = async (response) => {
		setError("");
		console.log(response);
		let loggedWithGoogle = await actions.loginGoogle(response);
		if (loggedWithGoogle) {
			navigate('/');
		}
		else {
			setError("Failed to log in with Google. Please check your email and password.");
		}
	};

	const handleFailure = (error) => {
		console.log(error);
		setError("Failed to log in. Please check your email and password.");
	};

	return (
		<Container fluid className="container-landingpage">
			<Row className="mt-3">
				<Col>
					<h1 className="heading1">Iniciar sesión</h1>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Contraseña</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
						</Form.Group>
						<a href="/reset-password" className="link">He olvidado mi contraseña</a>
						<button type="submit" className="button1 form-button">¡Entrar a Mymood!</button>
					</Form>
					{error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
				</Col>
			</Row>

			<Row className="text-center mt-5 mb-5">
				<Col>
					<p>O entrar con:</p>
					<GoogleProvider>
						<div >
							<GoogleLogin onSuccess={handleGoogleSuccess} onError={handleFailure} className="button1 form-button" />
						</div>
					</GoogleProvider>
				</Col>
			</Row>
		</Container >
	);
};

