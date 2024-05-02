
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

/* GOOGLE LOGIN */
import { GoogleLogin } from '@react-oauth/google';
import { GoogleProvider } from "../component/google";  // Asegúrate de que la ruta de importación es correcta

/* FORMIK */
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

/* MY MOOD STYLES */
import "../../styles/home.css";

/* REACT-BOOSTRAP */
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const MyTextInput = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input>. We can use field meta to show an error
	// message if the field is invalid and it has been touched (i.e. visited)
	const [field, meta] = useField(props);
 	
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input className="text-input" {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error mb-2 text-danger text-end">{meta.error}</div>
			) : null}
		</>
	);
};

// And now we can use these
export const Login = () => {
	const [error, setError] = useState("");
	const { actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(true);
	const navigate = useNavigate();

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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
						<h1 className="heading1 mb-4">Registro MyMood</h1>
						<Formik
							initialValues={{
								email: '',
								password: '',
							}}
							validationSchema={Yup.object({
								email: Yup.string()
									.email('Email no válido.')
									.required('* Campo obligatorio'),
								password: Yup.string()
									.required('* Se necesita contraseña')
									.min(4, '* La contraseña es demasiado corta, debe tener al menos 8 caracteres')
									.max(15, '* Contraseña demasiado larga máximo 15 caracteres'),
							})}

							onSubmit={async (values, { setSubmitting }) => {
								try {
									const logged = await actions.login(values['email'], values['password']);
									if (logged) {
										navigate("/choose-mood");
									} else {
										setError("Failed to log in. Please check your email and password.");
									}
								} catch (error) {
									// Manejar cualquier error aquí
									console.error('Error al registrar:', error);
								} finally {
									setSubmitting(false);
								}

								
							}}
						>
							<Form className="formik-form">
								<MyTextInput
									label="Email"
									name="email"
									type="email"
									placeholder="mail@mymood.com"
									className="w-100 mb-2 d-block"
								/>

								<MyTextInput
									label="Contraseña"
									name="password"
									type="password"
									placeholder="********"
									className="w-100 mb-2 d-block"
								/>
								<a variant="primary" onClick={handleShow} className="text-black text-end link">He olvidado mi contraseña</a>
								<button type="submit" className="mb-5">¡Entrar en My Mood!</button>
								<p className="text-center" style={{ fontFamily: 'var(--base-font-family)' }}>¿No tienes cuenta? <a variant="primary" href="/singup" className="text-black">Regístrate </a></p>
							</Form>
							
						</Formik>
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
				<Formik
							initialValues={{
								email: '',
							}}
							validationSchema={Yup.object({
								email: Yup.string()
									.email('Email no válido.')
									.required('* Campo obligatorio'),
							})}

							onSubmit={async (values, { setSubmitting }) => {
								try {
									const result = await actions.handleResetPassword(values['email']);
									
									if (result.status) {
										setIsError(false);
										setMessage("Consulta tu email para las instrucciones de reestablecimiento de contraseña.");
										console.log('Reset link sent successfully!');
									} else {
										setIsError(true);
										setMessage(result.message || "Ocurrió un error. Por favor, inténtalo de nuevo.");
									}
								} catch (error) {
									// Manejar cualquier error aquí
									console.error('Error al registrar:', error);
								} finally {
									setSubmitting(false);
								}
							}}
						>
							<Form className="formik-form">
								<MyTextInput
									label="Email"
									name="email"
									type="email"
									placeholder="mail@mymood.com"
									className="w-100 mb-2 d-block"
								/>
								<button type="submit" className="">Envíame el enlace</button>
							</Form>
							
						</Formik>
						<Row>
						<Col sm={12}>
							{message && (
								<div className={`mt-3 border p-3 ${isError ? "border-danger text-danger" : "border-success text-success"}`}>
									{message}
								</div>
							)}
						</Col>
					</Row> 

					{/* <Form onSubmit={handleResetPassword}>
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
					</Row> */}

				</Modal.Body>
			</Modal>
			
		</>
	);
};

export default Login;



// export const Login = () => {
	// const { actions } = useContext(Context);
	// const [email, setEmail] = useState("");
	// const [password, setPassword] = useState("");
	// const [error, setError] = useState("");
	// const [message, setMessage] = useState('');
	// const [isError, setIsError] = useState(true);
	// const navigate = useNavigate();

	// const [show, setShow] = useState(false);

	// const handleClose = () => setShow(false);
	// const handleShow = () => setShow(true);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		setError("");
// 		let logged = await actions.login(email, password);
// 		if (logged) {
// 			navigate("/choose-mood");
// 		} else {
// 			setError("Failed to log in. Please check your email and password.");
// 		}
// 	};

// 	const handleGoogleSuccess = async (response) => {
// 		setError("");
// 		console.log(response);
// 		let loggedWithGoogle = await actions.loginGoogle(response);
// 		if (loggedWithGoogle) {
// 			navigate('/choose-mood');
// 		}
// 		else {
// 			setError("Failed to log in with Google. Please check your email and password.");
// 		}
// 	};

// 	const handleFailure = (error) => {
// 		console.log(error);
// 		setError("Failed to log in. Please check your email and password.");
// 	};

// 	const handleResetPassword = async (e) => {
// 		e.preventDefault();
// 		const response = await actions.handleResetPassword(email)	
// 			if (!response.ok) {
// 				setIsError(true);
// 				setMessage(result.message || "Ocurrió un error. Por favor, inténtalo de nuevo.");
// 			} else {
// 				setIsError(false);
// 				setMessage("Consulta tu email para las instrucciones de reestablecimiento de contraseña.");
// 				console.log('Reset link sent successfully!');
// 				// navigate("/login");  // Optionally redirect to login
// 			}
// 	};
	
// 	return (
// 		<>

// 			<Container fluid className="container-landingpage">
// 				<Row className="mt-3">
// 					<Col>
// 						<h1 className="heading1">Iniciar sesión</h1>
// 						<Form onSubmit={handleSubmit}>
// 							<Form.Group className="mb-3" controlId="formBasicEmail">
// 								<Form.Label>Email</Form.Label>
// 								<Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
// 							</Form.Group>
// 							<Form.Group className="mb-3" controlId="formBasicPassword">
// 								<Form.Label>Contraseña</Form.Label>
// 								<Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
// 							</Form.Group>
// 							{/* <a href="/reset-password" className="link">He olvidado mi contraseña</a> */}
// 							<a variant="primary" onClick={handleShow} className="text-black text-end link">
// 								He olvidado mi contraseña
// 							</a>
// 							<button type="submit" className="button1 form-button mb-3">¡Entrar a Mymood!</button>
// 							<p className="text-center" style={{ fontFamily: 'var(--base-font-family)' }}>¿No tienes cuenta? <a variant="primary" href="/singup" className="text-black">Regístrate </a></p>
// 						</Form>
// 						{error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
// 					</Col>
// 				</Row>

			// 	<Row className="text-center mt-3 mb-5">
			// 		<Col>
			// 			<p>O entrar con:</p>
			// 			<GoogleProvider>
			// 				<div >
			// 					<GoogleLogin onSuccess={handleGoogleSuccess} onError={handleFailure} className="button1 form-button" />
			// 				</div>
			// 			</GoogleProvider>
			// 		</Col>
			// 	</Row>
			// </Container >

			// <Modal show={show} onHide={handleClose}>
			// 	<Modal.Header closeButton>
			// 		<Modal.Title className="heading1">Quiero recuperar mi contraseña</Modal.Title>
			// 	</Modal.Header>
			// 	<Modal.Body>
			// 		<Form onSubmit={handleResetPassword}>
			// 			<Row>
			// 				<Col sm={12}>
			// 					<Form.Control
			// 						type="email"
			// 						placeholder="Enter email"
			// 						value={email}
			// 						onChange={e => setEmail(e.target.value)}
			// 						required
			// 					/>
			// 				</Col>
			// 				<Col>
			// 					<button type="submit" className="button1 form-button mt-3" >Envíame el enlace</button>
			// 				</Col>
			// 			</Row>
			// 		</Form>
			// 		<Row>
			// 			<Col sm={12}>
			// 				{message && (
			// 					<div className={`mt-3 border p-3 ${isError ? "border-danger text-danger" : "border-success text-success"}`}>
			// 						{message}
			// 					</div>
			// 				)}
			// 			</Col>
			// 		</Row>

			// 	</Modal.Body>
			// </Modal>
// 		</>
// 	);
// };

