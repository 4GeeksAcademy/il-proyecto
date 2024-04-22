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
    const [key, setKey] = useState('article');
    const [resources, setResources] = useState(null); // Nuevo estado local para los recursos
 

    useEffect(() => {
        actions.getAllResources().then(res => {
            if (res) {
                setResources(store.resources); // Actualiza el estado local cuando se obtienen los recursos
                // const nombre = resources.resource_type;
                // const category = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                // setCategory(category);   
            }
            console.log(store.resources);
        });
    }, []);


    const data = store.resources.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });

    const firstFourItems = data.slice(0, 4);



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
                                <li className="articulo">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li className="articulo">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li className="articulo">Podcast - Título del recurso (Nombre psicólogo)</li>
                            </ul>
                        </Tab>
                        <Tab eventKey="video" title="Vídeos" className="resources">
                            <ul>
                                <li className="video">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li className="video">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li className="video">Podcast - Título del recurso (Nombre psicólogo)</li>
                            </ul>
                        </Tab>
                        <Tab eventKey="podcast" title="Podcast" className="resources" >
                            <ul>
                                <li className="podcast">Artículo - Título del recurso (Nombre psicólogo)</li>
                                <li className="podcast">Vídeo - Título del recurs (Nombre psicólogo)</li>
                                <li className="podcast">Podcast - Título del recurso (Nombre psicólogo)</li>
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
                            {firstFourItems.map(item => {
                                const nombre = item.resource_type;
                                const category = nombre ? nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
                                return (
                                    <li key={item.id} className={category}> <a href={item.url} target="_blank" rel="noreferrer">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{item.title}</div>
                                            {item.description}
                                        </div> </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                </Row>

            </Container>


        </Container >
    );
};
