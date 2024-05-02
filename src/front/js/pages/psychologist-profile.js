import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css'


/* MY MOOD COMPONENTS */
import ResourcesList from "../component/resourcesList";
import PsychologistProfileSkeletons from "../component/skeleton/psychologistProfileSkeletons"

/* MY MOOD STYLES */
import "../../styles/profile.css";

/* REACT BOOSTRAP ELEMENTS */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

export const PsychologistProfile = () => {
    const { store, actions } = useContext(Context);
    const { uid } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        actions.getPsychologistData(uid);
        actions.getPsychologistResources(uid);

    }, []);

    return (
        <>
            {loading ? (
                
                    <PsychologistProfileSkeletons />
                
            ) : (
                <>
                    <Container fluid className="border-bottom mt-3 border-dark mb-3" style={{
                        background: "rgb(210,247,82)",
                        background: "linear-gradient(0deg, rgba(210,247,82,1) 0%, rgba(255,255,255,1) 100%)"
                    }}>
                        <Container>
                            <Row className="mb-5">
                                <Col>
                                    <Image
                                        src={store?.psychologist_info?.profile_url}
                                        thumbnail
                                        className="border border-dark rounded-0"
                                        style={{ boxShadow: "5px 5px 0px #000" }}
                                        height={243.5}
                                        width={243.5}
                                    />
                                </Col>
                                <Col xs={7} className="d-flex align-items-end">
                                    <div className="d-flex flex-column justify-content-start align-items-end">
                                        <p className="w-100">[nº. {store?.psychologist_info?.collegiate_number} ]</p>
                                        <h1 className="w-100 m-0">{store?.psychologist_info?.name}</h1>
                                        <h1 className="w-100 m-0">{store?.psychologist_info?.surnames}</h1>
                                    </div>
                                </Col>
                                <Col className="d-flex justify-content-end align-items-end">
                                    <Button variant="dark" className="rounded-pill" href={`mailto:${store?.psychologist_info?.email}`}>Solicitar sesión &rarr;</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                    <Container fluid className="container-landingpage">
                        <Container className="user-profile">
                            <Row>
                                <Col xs={5}>
                                    <p>{store?.psychologist_info?.biography}</p>
                                    <Card className="user-info-profile">
                                        <ListGroup variant="flush">
                                            <ListGroup.Item><small>Email</small><p>{store?.psychologist_info?.email}</p></ListGroup.Item>
                                            <ListGroup.Item><small>Experiencia</small><p>{store?.psychologist_info?.experience} años</p></ListGroup.Item>
                                            <ListGroup.Item><small>Web</small><p><a href={store?.psychologist_info?.web} className="text-white text-decoration-none">Abrir web <small>&#8599;</small></a></p></ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                                <Col xs={7}>
                                    <h5 className="border-bottom border-dark mb-4">Recursos</h5>
                                    <ResourcesList list={store.psychologist_resources} />
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                </>
            )}
        </>
    );
}

export default PsychologistProfile;