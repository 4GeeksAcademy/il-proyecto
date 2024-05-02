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


export const UserProfileSkeleton = () => {
    
    return (
  
        <Container fluid className="container-landingpage">
            <Container className="user-profile pb-4 pt-4">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <h2 className=""><Skeleton height={25}/></h2>
                        <h3 className=""><Skeleton height={20}/></h3>
                    </Col>
                    <Col xs={1} md={6} lg={2} className="text-end">
                        {activeUser?.user_mood ? (
                            <Image src={activeUser?.user_mood.category_mood.icon_url} className="img-mood" />
                        ) : (<div></div>)}
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
    );
};

export default UserProfileSkeleton;
