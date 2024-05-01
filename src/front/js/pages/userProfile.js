import React, { useState, useContext, useEffect, } from "react";
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
    const params = useParams();
    const navigate = useNavigate();

    const activeUser = store?.active_users.find(user => user.id === parseInt(params.uid));

    console.log(activeUser);

    const handleProfileClick = (psychologistId) => {
        navigate(`/psychologist-profile/${psychologistId}`);
    };



    return (

        <Container fluid className="container-landingpage">
            <Container className="user-profile pb-4 pt-4">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <h2 className="">{activeUser?.name} {activeUser?.surnames}</h2>
                        <h3 className="">{activeUser?.hobbie}</h3>
                    </Col>
                    <Col xs={1} md={6} lg={2} className="text-end">
                        {activeUser?.user_mood ? (
                            <Image src={activeUser?.user_mood.category_mood.icon_url} className="img-mood" />
                        ) : (<div>no hay mood</div>)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <Card className="user-info-profile">
                            <ListGroup variant="flush">
                                <ListGroup.Item><small>Email</small><p>{activeUser?.email}</p></ListGroup.Item>
                                <ListGroup.Item><small>Contraseña</small><p>Cambiar contraseña <small>&#8599;</small></p></ListGroup.Item>
                                <ListGroup.Item><small>Unido/a</small><p>{activeUser?.created_at}</p></ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} md={6} lg={8}>
                        <Row>
                            <h4 className="border-bottom border-dark mb-3 p-0">Mis psicólogos de referencia</h4>
                            {activeUser?.psychologists.length === 0 ? (
                                <div>No tienes psycógolos de referencia. Cuando realices alguna sesión con ellos, se guardarán aquí.</div>
                            ) : (
                                activeUser?.psychologists.map((psychologist, index) => {
                                    return (
                                        <Col xs={12} md={6} lg={6} className="text-center" key={index}>
                                            <div className="ps-card p-3">
                                                <Image src={psychologist.profile_url} className="img-mood" roundedCircle />
                                                <h5>{psychologist.name} {psychologist.surnames}</h5>
                                                <p><small> [nº. {psychologist.collegiate_number} ]</small></p>
                                                <button className="btn btn-dark rounded-pill" onClick={() => handleProfileClick(psychologist.id)}>Ver perfil &rarr;</button>
                                            </div>
                                        </Col>
                                    )
                                })
                            )}
                        </Row>
                    </Col>
                </Row>

            </Container>
        </Container >
    );
};
