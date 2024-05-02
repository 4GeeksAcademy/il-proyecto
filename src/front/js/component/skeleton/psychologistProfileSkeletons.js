import React from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

/* MY MOOD COMPONETS */
import ResourcesListSkeletons from "./resourcesListSkeletons";

/* MY MOOD STYLES */

/* REACT BOOSTRAP ELEMENTS */
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';


const PsychologistProfileSkeletons = ( ) => {


    return (
        <>
            <Container fluid className="border-bottom mt-3 border-dark mb-3" style={{
                background: "rgb(210,247,82)",
                background: "linear-gradient(0deg, rgba(210,247,82,1) 0%, rgba(255,255,255,1) 100%)"
            }}>
                <Container className="">
                    <Row className="mb-5 ">
                        <Col>
                            <Skeleton thumbnail
                                className="border border-dark rounded-0"
                                style={{ boxShadow: "5px 5px 0px #000" }}
                                height={243.5}
                                width={243.5} />
                        </Col>
                        <Col xs={7} className="d-flex align-items-end">
                            <div className="d-flex flex-column justify-content-start align-items-end">
                                <Skeleton width={250} height={31.5} />
                                <Skeleton width={250} height={75.24} className="m-0" />
                                <Skeleton width={250} height={75.24} className="m-0" />
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-end align-items-end">
                            <Button variant="dark" className="rounded-pill" >Solicitar sesión &rarr;</Button>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Container fluid className="container-landingpage">
                <Container className="user-profile">
                    <Row>
                        <Col xs={5}>
                            <Skeleton count={6} />
                            <Card className="user-info-profile mt-3">
                                <ListGroup variant="flush">
                                    <ListGroup.Item><small>Email</small><Skeleton count={1} /> </ListGroup.Item>
                                    <ListGroup.Item><small>Experiencia</small><Skeleton count={1} /> </ListGroup.Item>
                                    <ListGroup.Item><small>Web</small><Skeleton count={1} /> </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={7}>
                            <h5 className="border-bottom border-dark mb-4">Recursos</h5>
                            <ResourcesListSkeletons /> 
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>

    );
};

export default PsychologistProfileSkeletons;
