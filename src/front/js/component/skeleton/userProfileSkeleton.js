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
                        <h2 className=""><Skeleton width={100} height={25}/></h2>
                        <h3 className=""><Skeleton width={100} height={20}/></h3>
                    </Col>
                    <Col xs={1} md={6} lg={2} className="text-end">
                        <Skeleton height={40}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <Card className="user-info-profile">
                            <ListGroup variant="flush">
                                <Skeleton width={250} height={31.5} />
                                <Skeleton width={250} height={75.24} className="m-0" />
                                <Skeleton width={250} height={75.24} className="m-0" />
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} md={6} lg={8}>
                            <Skeleton width={250} height={75.24} className="m-0" />
                        <Row>
                            <h4 className="border-bottom border-dark mb-3 p-0">Mis psicólogos de referencia</h4>
                            <Skeleton width={250} height={75.24} className="m-0" />
                        </Row>
                    </Col>
                </Row>

            </Container>
        </Container >
    );
};

export default UserProfileSkeleton;
