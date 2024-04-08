import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

/* React boostrap */
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* GOOGLE LOGIN */
import { jwtDecode } from "jwt-decode";


export const Login = () => {
	const [user, setUser] = useState({});

	const { store, actions } = useContext(Context);

	const handleCallbackResponse = (response) => {
		console.log("Encoded JWT ID token: " + response.credential);
		var userObject = jwtDecode(response.credential);
		console.log(userObject);
		setUser(userObject); // Actualiza el estado local `user`
		actions.setUser(userObject); // Actualiza el estado global `user` en flux.js
		// Oculta el botón de Google SignIn
		document.getElementById("signInDiv").hidden = true;
	};

	const handleSignOut = () => {
		setUser(null); // Limpia el estado local `user`
		actions.clearUser(); // Limpia el estado global `user` en flux.js
		// Muestra el botón de Google SignIn
		document.getElementById("signInDiv").hidden = false;
	};

	useEffect(() => {

		const isApiScriptLoaded = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

		if (!isApiScriptLoaded) {
			// Crea un nuevo elemento script
			const script = document.createElement('script');
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => {
				// El script se ha cargado y está listo para usar
				console.log("Google API script loaded successfully.");
				// Aquí puedes inicializar o ejecutar tu lógica relacionada con la API de Google
			};
			script.onerror = () => {
				console.error("Error loading the Google API script.");
			};
			// Añade el script al documento
			document.body.appendChild(script);
		}

		/* global google */
		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			callback: handleCallbackResponse

		})

		google.accounts.id.renderButton(
			document.getElementById("signInDiv"),
			{ theme: "outline", size: "large" }
		);

	}, []);

	//If we have no user: sign in button 
	//If we have a user: show the log out button 

	return (

		<Container fluid>
			<Row>
				<Col></Col>
				<Col xs={6}>
					<h1>Iniciar sesión</h1>
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" placeholder="Enter email" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Contraseña</Form.Label>
							<Form.Control type="password" placeholder="Password" />
						</Form.Group>
						<Button variant="link">He olvidado mi contraseña</Button>
						<Button variant="primary" type="submit">
							¡Entrar a Mymood!
						</Button>
					</Form>
					<p>O entrar con:</p>

					<div className="text-center mt-5">
						<div id="signInDiv"></div> {/* Botón de Google SignIn */}
					</div>
				</Col>
				<Col></Col>
			</Row>





		</Container>

	);
};

