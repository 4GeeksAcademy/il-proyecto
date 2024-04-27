
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
import Modal from 'react-bootstrap/Modal';


export const Login = () => {
	const { actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(true);
	const navigate = useNavigate();

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		let logged = await actions.login(email, password);
		if (logged) {
			navigate("/choose-mood");
		} else {
			setError("Failed to log in. Please check your email and password.");
		}
	};

	const handleGoogleSuccess = async (response) => {
		setError("");
		console.log(response);
		let loggedWithGoogle = await actions.loginGoogle(response);
		if (loggedWithGoogle) {
			navigate('/choose-mood');
		}
		else {
			setError("Failed to log in with Google. Please check your email and password.");
		}
	};

	const handleFailure = (error) => {
		console.log(error);
		setError("Failed to log in. Please check your email and password.");
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		const response = await actions.handleResetPassword(email)	
			if (!response.ok) {
				setIsError(true);
				setMessage(result.message || "Ocurrió un error. Por favor, inténtalo de nuevo.");
			} else {
				setIsError(false);
				setMessage("Consulta tu email para las instrucciones de reestablecimiento de contraseña.");
				console.log('Reset link sent successfully!');
				// navigate("/login");  // Optionally redirect to login
			}
	};
	
	return (
		<>

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
							{/* <a href="/reset-password" className="link">He olvidado mi contraseña</a> */}
							<a variant="primary" onClick={handleShow} className="text-black text-end link">
								He olvidado mi contraseña
							</a>
							<button type="submit" className="button1 form-button mb-3">¡Entrar a Mymood!</button>
							<p className="text-center" style={{ fontFamily: 'var(--base-font-family)' }}>¿No tienes cuenta? <a variant="primary" href="/singup" className="text-black">Regístrate </a></p>
						</Form>
						{error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
					</Col>
				</Row>

				<Row className="text-center mt-3 mb-5">
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

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title className="heading1">Quiero recuperar mi contraseña</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleResetPassword}>
						<Row>
							<Col sm={12}>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</Col>
							<Col>
								<button type="submit" className="button1 form-button mt-3" >Envíame el enlace</button>
							</Col>
						</Row>
					</Form>
					<Row>
						<Col sm={12}>
							{message && (
								<div className={`mt-3 border p-3 ${isError ? "border-danger text-danger" : "border-success text-success"}`}>
									{message}
								</div>
							)}
						</Col>
					</Row>

				</Modal.Body>
			</Modal>
		</>
	);
};

