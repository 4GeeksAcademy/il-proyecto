import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const PhycologystProfile = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const [phycologystProfile, setPhycologystProfile] = useState(null);
    const [phycologysts, setPhycologysts] = useState([]);
    const [allResources, setAllResources] = useState([]);

    useEffect(() => {
        actions.getPhycologyst().then(res => {
            if (res) {
                setPhycologysts(res.results);
            }
        }).catch(error => {
            console.error('Error fetching or processing phycologyst data:', error);
        });

        actions.getAllResources().then(res => {
            if (res) {
                setAllResources(res);
            }
        }).catch(error => {
            console.error('Error fetching resources:', error);
        });
    }, []);

    useEffect(() => {
        if (phycologysts.length > 0) {
            const urlParts = window.location.pathname.split('/');
            const psychologistId = urlParts[urlParts.length - 1];
            const profile = phycologysts.find(psychologist => psychologist.id === parseInt(psychologistId));
            if (profile) {
                setPhycologystProfile(profile);
            } else {
                console.error(`Psychologist with ID ${psychologistId} not found`);
            }
        }
    }, [phycologysts]);

    

    return (
        <Container fluid className="container-landingpage">
            <Container className="profile-psychologist">
                {phycologystProfile && (
                    <>
                        <Row className="mb-5">
                            <Col xs={11} md={6} lg={10}>
                                <h2>{phycologystProfile.name} {phycologystProfile.surnames}</h2>
                                <h3>Numero de colegiado: {phycologystProfile.collegiate_number}</h3>
                            </Col>
                            <Col xs={1} md={6} lg={2} className="text-end">
                            <Image src={phycologystProfile.profile_url} className="psychologist-profile" roundedCircle style={{ width: '150px', height: '150px' }} />

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={3}>
                                <Card className="user-info-profile">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item><strong>Email: </strong>{phycologystProfile.email}</ListGroup.Item>
                                        <ListGroup.Item><strong>Experiencia: </strong>{phycologystProfile.experience}</ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Web: </strong>
                                            <a href={phycologystProfile.web} style={{ color: 'white' }}>{phycologystProfile.web}</a>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col xs={12} md={6} lg={9}>
                                <ButtonGroup vertical className="actions-buttons">
                                    <Button className="btn-block" size="lg">Iniciar Chat</Button>
                                </ButtonGroup><br />
                                <p><strong>Biografía:</strong> {phycologystProfile.biography}</p>
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
                                    {/* Aquí puedes usar allResources para mostrar los recursos */}
                                </ul>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </Container>
    );
};

export default PhycologystProfile;
