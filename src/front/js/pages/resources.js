import React, { useState, useContext } from "react";
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
    const [key, setKey] = useState('article');


    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <h1 className="heading1">Recursos</h1>
                    </Col>
                </Row>
                <Row>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="article" title="Artículos" className="resources">
                            <ul>
                                <li class="articulo">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li class="articulo">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li class="articulo">Podcast - Título del recurso (Nombre psicólogo)</li>
                            </ul>
                        </Tab>
                        <Tab eventKey="video" title="Vídeos" className="resources">
                            <ul>
                                <li class="video">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li class="video">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li class="video">Podcast - Título del recurso (Nombre psicólogo)</li>
                            </ul>
                        </Tab>
                        <Tab eventKey="podcast" title="Podcast" className="resources" >
                            <ul>
                                <li class="podcast">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li class="podcast">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li class="podcast">Podcast - Título del recurso (Nombre psicólogo)</li>
                            </ul>
                        </Tab>
                    </Tabs>

                </Row>

                <Row className="mt-5">
                    <Col xs={12} md={12} lg={12}>
                        <h4 className="border-bottom border-dark mb-3">¡No te pierdas lo último!</h4>
                    </Col>
                </Row>

                <Row>
                    <Col className="resources">
                        <ul>
                            <li class="articulo">Artículo - Título del recurso (Nombre psicólogo)</li>
                            <li class="video">Vídeo - Título del recurs (Nombre psicólogo)</li>
                            <li class="podcast">Podcast - Título del recurso (Nombre psicólogo)</li>
                        </ul>
                    </Col>
                </Row>

            </Container>


        </Container >
    );
};
