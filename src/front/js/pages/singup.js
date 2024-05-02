
import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



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

const MyCheckbox = ({ children, ...props }) => {
	// React treats radios and checkbox inputs differently from other input types: select and textarea.
	// Formik does this too! When you specify `type` to useField(), it will
	// return the correct bag of props for you -- a `checked` prop will be included
	// in `field` alongside `name`, `value`, `onChange`, and `onBlur`
	const [field, meta] = useField({ ...props, type: 'checkbox' });
	return (
		<div>
			<label className="checkbox-input border-0 bg-transparent">
				<input type="checkbox" {...field} {...props} />
				{children}
			</label>
			{meta.touched && meta.error ? (
				<div className="error mb-2 text-danger text-end">{meta.error}</div>
			) : null}
		</div>
	);
};

const MySelect = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<div>
			<label htmlFor={props.id || props.name}>{label}</label>
			<select {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};


// And now we can use these
export const SignUp = () => {
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { actions } = useContext(Context);

	return (
		<>
			<Container fluid className="container-landingpage">
				<Row className="mt-3">
					<Col>
						<h1 className="heading1">Registro MyMood</h1>
						<Formik
							initialValues={{
								name: '',
								surnames: '',
								email: '',
								password: '',
								validatePassword: '',
								acceptedTerms: false,
							}}
							validationSchema={Yup.object({
								name: Yup.string()
									.max(15, 'Tiene que ser 15 caracteres o menos.')
									.required('* Campo obligatorio'),
								surnames: Yup.string()
									.max(20, 'Tiene que ser 20 caracteres o menos.')
									.required('* Campo obligatorio'),
								email: Yup.string()
									.email('Email no válido.')
									.required('* Campo obligatorio'),
								acceptedTerms: Yup.boolean()
									.required('* Campo obligatorio')
									.oneOf([true], '* Debes aceptar los términos y condiciones'),
								password: Yup.string()
									.required('* Se necesita contraseña')
									.min(4, '* La contraseña es demasiado corta, debe tener al menos 8 caracteres')
									.max(15, '* Contraseña demasiado larga máximo 15 caracteres'),
								validatePassword: Yup.string()
									.required('* Debes confirmar tu contraseña')
									.oneOf([Yup.ref('password')], '* Las contraseñas no coinciden')
								// .required('No password provided.') 
								// .min(8, 'Password is too short - should be 8 chars minimum.')
								// .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
								// .max('Conntraseña incorrecta'),
								// jobType: Yup.string()
								// 	.oneOf(
								// 		['designer', 'development', 'product', 'other'],
								// 		'Invalid Job Type'
								// 	)
								// .required('Required'),
							})}

							onSubmit={async (values, { setSubmitting }) => {
								try {
									const result = await actions.signUp(values['name'], values['surnames'], values['email'], values['password']);
									
									if (result.status) {
										console.log(result.msg);
										actions.login(values['email'], values['password']);
										navigate("/choose-mood");
									} else {
										setError(result.msg);
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
									label="Nombre"
									name="name"
									type="text"
									placeholder="Nombre"
									className="w-100 mb-2 d-block"
								/>

								<MyTextInput
									label="Apellidos"
									name="surnames"
									type="text"
									placeholder="Apellidos"
									className="w-100 mb-2 d-block"
								/>

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

								<MyTextInput
									label="Repite la contraseña"
									name="validatePassword"
									type="password"
									placeholder="********"
									className="w-100 mb-2 d-block"
								/>

								{/* <MySelect label="Job Type" name="jobType">
									<option value="">Select a job type</option>
									<option value="designer">Designer</option>
									<option value="development">Developer</option>
									<option value="product">Product Manager</option>
									<option value="other">Other</option>
								</MySelect> */}

								<MyCheckbox name="acceptedTerms" className="form-check-input mb-1 ">
									Acepto los términos y condiciones (Ver <a href="/legal#policy">política de privacidad</a>)
								</MyCheckbox>

								<button type="submit">¡Crear cuenta!</button>
							</Form>
							
						</Formik>
						{error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default SignUp;