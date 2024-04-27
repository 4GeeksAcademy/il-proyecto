import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import "../../styles/profile.css";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';



export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");


    useEffect(() => {

    }, []);

    console.log(store.user);

    // if (!store.user || Object.keys(store.user).length === 0) {
    //     return null; // O puedes retornar un componente de carga
    // }
    if (!store.user || !store.user.psychologists || store.user.psychologists.length === 0) {
        return null; // O puedes retornar un componente de carga
    }

    let created_at = store.user.created_at;
    let dateOnly = created_at.split(' ')[0];

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const halfwayIndex = Math.ceil(store.user.psychologists.length / 2);
    const firstHalf = store.user.psychologists.slice(0, halfwayIndex);
    const secondHalf = store.user.psychologists.slice(halfwayIndex);

    // const handleResetPassword = async (e) => {
    // 	e.preventDefault();
    // 	const response = await actions.handleResetPassword(email);
    // 		if (!response.ok) {
    // 			setIsError(true);
    // 			setMessage(result.message || "Ocurrió un error. Por favor, inténtalo de nuevo.");
    // 		} else {
    // 			setIsError(false);
    // 			setMessage("Consulta tu email para las instrucciones de reestablecimiento de contraseña.");
    // 			console.log('Reset link sent successfully!');
    // 		}
    // };

    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <h2 className="">{store.user.name} {store.user.surnames}</h2>
                        <h3 className="">{store.user.hobbie}</h3>
                    </Col>
                    <Col xs={1} md={6} lg={2} className="text-end">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-0%402x.png?alt=media&token=dc422f85-022b-44de-a81d-16b84f250ea4" className="img-mood" />
                    </Col>

                </Row>
                <Row>
                    <Col xs={12} md={6} lg={3}>
                        <Card className="user-info-profile">
                            <ListGroup variant="flush">
                                <ListGroup.Item><p>Email</p><p>{store.user.email}</p></ListGroup.Item>
                                <ListGroup.Item><p>Contraseña</p>
                                    {/* <a variant="primary" onClick={handleShow} className="text-black text-end link"> Cambiar mi contraseña</a> */}
                                    <a href="/login">Cambiar mi contraseña</a>
                                </ListGroup.Item>
                                <ListGroup.Item><p>Unido/a</p><p>{dateOnly}</p></ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} md={6} lg={9}>
                        <ButtonGroup vertical className="actions-buttons">
                            <Button className="btn-block" size="lg">Opción 1</Button>
                            <Button className="btn-block" size="lg">Opción 2</Button>
                            <Button className="btn-block" size="lg">Opción 3</Button>
                            <Button className="btn-block" size="lg">Opción 1</Button>
                            <Button className="btn-block" size="lg">Opción 2</Button>
                            <Button className="btn-block" size="lg">Opción 3</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col xs={12} md={12} lg={12}>
                        <h4 className="border-bottom border-dark mb-3">Mis recursos</h4>
                    </Col>
                </Row>

                <Row>
                    <Col className="resources">
                        <ul>
                            <li className="articulo">Artículo - Título del recurso (Nombre psicólogo)</li>
                            <li className="video">Vídeo - Título del recurs (Nombre psicólogo)</li>
                            <li className="podcast">Podcast - Título del recurso (Nombre psicólogo)</li>
                        </ul>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col xs={12} md={12} lg={12}>
                        <h4 className="border-bottom border-dark mb-3">Mis psicólogos de referencia</h4>
                    </Col>
                </Row>
                {/* <Row>
                    <Col xs={12} md={6} lg={3} className="text-center">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-1b.webp?alt=media&token=05bc6a22-e3f8-42d4-9ab5-426a2fe72cb4" className="img-mood" roundedCircle />
                        <p>nombre psicólogo</p>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="text-center">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-4g.webp?alt=media&token=1dfe2334-1f82-4cb2-a8d2-2206b027fc31" className="img-mood" roundedCircle />
                        <p>nombre psicólogo</p>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="text-center">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-profile.webp?alt=media&token=2363922b-b6ca-451d-be3f-197185a61beb" className="img-mood" roundedCircle />
                        <p>nombre psicólogo</p>
                    </Col>
                    <Col xs={12} md={6} lg={3} className="text-center">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-profile.webp?alt=media&token=2363922b-b6ca-451d-be3f-197185a61beb" className="img-mood" roundedCircle />
                        <p>nombre psicólogo</p>
                    </Col>
                </Row> */}
                <Row>
                    <Col xs={12} md={6} lg={6} className="text-center">
                        {firstHalf.map(psychologist => (
                            <div className="ps-card p-3" key={psychologist.id}>
                                <Image src={psychologist.profile_url} className="img-mood" roundedCircle />
                                <p className="fw-bold">{psychologist.name} {psychologist.surnames}</p>
                                <p className="small">{psychologist.biography}</p>
                                <a href="#" className="small btn btn-dark btn-sm rounded-pill">Ver perfil &rarr;</a>
                            </div>
                        ))}
                    </Col>
                    <Col xs={12} md={6} lg={6} className="text-center">
                        {secondHalf.map(psychologist => (
                            <div key={psychologist.id}>
                                <Image
                                    src={psychologist.profile_url || "https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-profile.webp?alt=media&token=2363922b-b6ca-451d-be3f-197185a61beb"}
                                    className="img-mood"
                                    roundedCircle
                                />
                                <p>{psychologist.name} {psychologist.surnames}</p>
                                <p>{psychologist.biography}</p>
                            </div>
                        ))}
                    </Col>
                </Row>
            </Container>
            {/* <Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title className="heading1">Quiero cambiar mi contraseña</Modal.Title>
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
			</Modal> */}
        </Container>
    );
};
