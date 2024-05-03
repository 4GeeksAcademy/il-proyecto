import React from 'react';
import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useLocation } from "react-router-dom";

/* FORMIK */
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

/* MY MOOD STYLES */
import "../../styles/home.css";

/* REACT-BOOSTRAP */
import { Container, Row, Col } from 'react-bootstrap';


const MyTextInput = ({ label, ...props }) => {
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
export const ResetPassword = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState('');

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

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
                                password: Yup.string()
                                    .required('* Se necesita contraseña')
                                    .min(4, '* La contraseña es demasiado corta, debe tener al menos 8 caracteres')
                                    .max(15, '* Contraseña demasiado larga máximo 15 caracteres'),
                                validatePassword: Yup.string()
                                    .required('* Debes confirmar tu contraseña')
                                    .oneOf([Yup.ref('password')], '* Las contraseñas no coinciden')
                            })}

                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await actions.resetPassword(token, values['password']);
                                    if (!response.ok) {
                                        const data = await response.json();
                                        throw new Error(data.message || 'Hubo un error al restablecer la contraseña');
                                    }
                                    setSuccessMessage('¡Contraseña restablecida con éxito!');
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
                                    label="Nueva contraseña"
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
                                <button type="submit" className="mb-5">¡Crear cuenta!</button>
                            </Form>
                        </Formik>
                        {error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
                        {successMessage && <div className="text-success mt-3 border border-success p-3">{successMessage}</div>}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ResetPassword;