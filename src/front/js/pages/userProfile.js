import React, { useState, useContext, useEffect, } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/* FORMIK */
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

/* MY MOOD STYLES */
import "../../styles/profile.css";

/* MY MOOD CONPONENTS */
import PsychologistCard from "../component/psychologistCard";
import { userProfileSkeleton } from "../component/skeleton/userProfileSkeleton";

/* REACT-BOOSTRAP */
import { Container, Row, Col, Image, Card, ListGroup, Button, Modal } from 'react-bootstrap';


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

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [modalShow, setModalShow] = React.useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState('');



    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <p>Recuperar contraseña MyMood</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Formik
                        initialValues={{
                            password: '',
                            validatePassword: '',
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
                                const response = await actions.resetPasswordProfile(userData.id, values['password']);
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
                            <button type="submit" className="mb-5">¡Cambiar contraseña!</button>
                        </Form>
                    </Formik>
                    {error && <div className="text-danger mt-3 border border-danger p-3">{error}</div>}
                    {successMessage && <div className="text-success mt-3 border border-success p-3">{successMessage}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="" onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await actions.getUserById(parseInt(params.uid));
            if (!data) {
                console.log("No se ha encontrado el usuario");
                navigate("/404");
            } else {
                console.log("Usuario encontrado:", data);
                setUserData(data);
            }
        };

        fetchUserData();
    }, [params.uid]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container fluid className="container-landingpage">
                <Container className="user-profile pb-4 pt-4">
                    <Row className="mb-5">
                        <Col xs={11} md={6} lg={10}>
                            <h2 className="">{userData?.name} {userData?.surnames}</h2>
                            {userData?.hobbie ? (<h3 className="">Lo que más me gusta es... {userData?.hobbie}</h3>) : (<div></div>)}
                        </Col>
                        <Col xs={1} md={6} lg={2} className="text-end">
                            {userData?.user_mood ? (
                                <Image src={userData?.user_mood.category_mood.icon_url} className="img-mood" />
                            ) : (<div></div>)}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6} lg={4}>
                            <Card className="user-info-profile">
                                <ListGroup variant="flush">
                                    <ListGroup.Item><small>Email</small><p>{userData?.email}</p></ListGroup.Item>
                                    {userData?.id !== JSON.parse(sessionStorage.getItem('userData')).id
                                        ? (<div></div>)
                                        : (<ListGroup.Item><small>Contraseña</small>
                                            <Button variant="primary" onClick={() => setModalShow(true)}>Cambiar contraseña <small>&#8599;</small></Button>
                                        </ListGroup.Item>)
                                    }
                                    <ListGroup.Item><small>Unido/a</small><p>{userData?.created_at}</p></ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={8}>
                            <Row>
                                <h4 className="border-bottom border-dark mb-3 p-0">Mis psicólogos de referencia</h4>
                                {userData?.psychologists.length === 0 ? (
                                    <div>No tienes psicólogos de referencia. Cuando realices alguna sesión con ellos, se guardarán aquí.</div>
                                ) : (
                                    userData?.psychologists.map((psychologist, index) => {
                                        return (
                                            <Col xs={12} md={6} lg={6} className="text-center" key={index}>
                                                <PsychologistCard
                                                    id={psychologist.psychologist_info.id}
                                                    name={psychologist.psychologist_info.name}
                                                    surnames={psychologist.psychologist_info.surnames}
                                                    col_num={psychologist.psychologist_info.collegiate_number}
                                                    image={psychologist.psychologist_info.profile_url}
                                                />
                                            </Col>
                                        )
                                    })
                                )}
                            </Row>
                        </Col>
                    </Row>

                </Container>
            </Container >
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>

    );
};

export default UserProfile;

