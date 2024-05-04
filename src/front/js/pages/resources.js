import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import { useNavigate } from "react-router-dom";

/* MY MOOD COMPONENTS */
import ResourcesList from "../component/resourcesList";
import ResourcesSkeletons from "../component/skeleton/resourcesSkeletons";

/* REACT-BOSTRAP */
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';



export const Resources = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [resources, setResources] = useState(null); // Nuevo estado local para los recursos
    const [key, setKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
        actions.getAllResources().then(res => {
            if (res) {
                setResources(store.resources);
            }
            setKey(store.resources[0].type);
            console.log(store.resources);
        });
    }, []);

    let allResources = [].concat(...store.resources.map(type => type.resources));

    allResources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    let lastFour = allResources.slice(0, 4);

    function CustomTitle({ type }) {
        return (
            <span className="cta-button">
                {type}
            </span>
        );
    }

    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                {loading
                    ? (<ResourcesSkeletons />)
                    : (
                        <>
                            <Row className="mb-2 justify-content-center">
                                <Col xs={11} md={6} lg={10}>
                                    <h1 className="heading1">Recursos</h1>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col xs={12} md={12} lg={12}>
                                    <h4 className="border-bottom border-dark mb-3">¡No te pierdas lo último!</h4>
                                </Col>
                            </Row>

                            <Row>
                                <Col className="resources">
                                    <ResourcesList list={lastFour.slice(0, 2)} />
                                </Col>
                                <Col className="resources">
                                    <ResourcesList list={lastFour.slice(2, 4)} />
                                </Col>
                            </Row>

                            <Row className="mt-5">
                                <Col xs={12} md={12} lg={12}>
                                    <h4 className="border-bottom border-dark mb-4">Todos nuestros recursos</h4>
                                </Col>
                            </Row>

                            <Row>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                    className="align-items-center justify-content-center "
                                >
                                    {store.resources.map(type => (
                                        <Tab key={type.type} eventKey={type.type} title={<CustomTitle type={type.type} />}>
                                            <ResourcesList list={type.resources} />
                                        </Tab>
                                    ))}
                                </Tabs>
                            </Row>
                        </>
                    )}
            </Container>
        </Container>

    );
};
