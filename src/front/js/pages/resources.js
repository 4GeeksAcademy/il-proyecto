import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



export const Resources = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [resources, setResources] = useState(null); // Nuevo estado local para los recursos
    const [key, setKey] = useState(null);

    useEffect(() => {
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
                        <ul>
                            {lastFour.slice(0, 2).map((item, index) => {
                                let type = store.resources.find(type => type.resources.includes(item));
                                return (
                                    <li key={index} className={type.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}>
                                        <a href={item.url} target="_blank" rel="noreferrer">
                                            <span className="fw-bold">
                                                {item.title}
                                                <br />
                                                <p>{item.description}</p>
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                    <Col className="resources">
                        <ul>
                            {lastFour.slice(2, 4).map((item, index) => {
                                let type = store.resources.find(type => type.resources.includes(item));
                                return (
                                    <li key={index + 2} className={type.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}>
                                        <a href={item.url} target="_blank" rel="noreferrer">
                                            <span className="fw-bold">
                                                {item.title}
                                                <br />
                                                <p>{item.description}</p>
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col xs={12} md={12} lg={12}>
                        <h4 className="border-bottom border-dark mb-3">Todos nuestros recursos</h4>
                    </Col>
                </Row>

                <Row>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="align-items-center justify-content-center resources"
                    >
                        {store.resources.map(type => (
                            <Tab key={type.type} eventKey={type.type} title={<CustomTitle type={type.type} />} className="resources">
                                <ul>
                                    {type.resources.map((item, index) => (
                                        <li key={index} className={type.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}>
                                            <a href={item.url} target="_blank" rel="noreferrer">
                                                <span className="fw-bold">
                                                    {item.title}
                                                    <br />
                                                    <p>
                                                        {item.description}<br />
                                                        <span style={{ fontSize: "var(--small-size)" }}>
                                                            Recomendado por: <span style={{ fontSize: "var(--small-size)" }}>{item.psychologist_info.name} {item.psychologist_info.surnames}</span>
                                                        </span>
                                                    </p>
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Tab>
                        ))}
                    </Tabs>
                </Row>
            </Container>
        </Container>
    );
};
