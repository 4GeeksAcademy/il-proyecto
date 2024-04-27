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


    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <h2 className="">{store.user?.name} {store.user?.surnames}</h2>
                        <h3 className="">{store.user?.hobbie}</h3>
                    </Col>
                    <Col xs={1} md={6} lg={2} className="text-end">
                        {store.user?.user_mood ? (
                            <Image src={store.user.user_mood.category_mood.icon_url} className="img-mood" />
                        ) : (<div>no hay mood</div>)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <Card className="user-info-profile">
                            <ListGroup variant="flush">
                                <ListGroup.Item><small>Email</small><p>{store.user?.email}</p></ListGroup.Item>
                                <ListGroup.Item><small>Contraseña</small><p>Cambiar contraseña <small>&#8599;</small></p></ListGroup.Item>
                                <ListGroup.Item><small>Unido/a</small><p>{store.user?.created_at}</p></ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} md={6} lg={8}>
                        <h4 className="border-bottom border-dark mb-3">Mis psicólogos de referencia</h4>
                        {store.user?.psychologists.length === 0 ? (
                            <div>No tienes psycógolos de referencia. Cuando realices alguna sesión con ellos, se guardarán aquí.</div>
                        ) : (
                            store.user?.psychologists.map((psychologist, index) => {
                                return (
                                    <Col xs={12} md={6} lg={6} className="text-center" key={index}>
                                        <div className="ps-card p-2">
                                            <Image src={psychologist.profile_url} className="img-mood" roundedCircle />
                                            <h5>{psychologist.name} {psychologist.surnames}</h5>
                                            <p><small> [nº. {psychologist.collegiate_number} ]</small></p>
                                            <button className="btn btn-dark rounded-pill">Ver perfil &rarr;</button>
                                        </div>
                                    </Col>
                                )
                            })
                        )}
                    </Col>
                </Row>

                {/* <Row className="mt-5">
                    <Col xs={12} md={12} lg={12}>
                        <h4 className="border-bottom border-dark mb-3">Mis psicólogos de referencia</h4>
                        
                    </Col>
                </Row>
                <Row>
                    {store.user?.psychologists.length === 0 ? (
                        <div>No tienes psycógolos de referencia. Cuando realices alguna sesión con ellos, se guardarán aquí.</div>
                    ) : (
                        store.user?.psychologists.map((psychologist, index) => {
                            return (
                                <Col xs={12} md={6} lg={6} className="text-center" key={index}>
                                    <div className="ps-card p-3">
                                        <Image src={psychologist.profile_url} className="img-mood" roundedCircle />
                                        <h5>{psychologist.name} {psychologist.surnames} <em>[ {psychologist.collegiate_number} ]</em></h5>
                                        <p style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>{psychologist.biography}</p>
                                        <button className="btn btn-dark rounded-pill">Ver perfil &rarr;</button>
                                    </div>
                                </Col>
                            )
                        })
                    )}
                </Row> */}
                {/* <Row className="mt-5">
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
                </Row> */}
            </Container>
        </Container >
    );
};




