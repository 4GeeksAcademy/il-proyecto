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
                setResources(store.resources);
            }
            console.log(store.resources);
        });
    }, []);


    const data = store.resources.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });

    const data_type = store.resources.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
    });



    const firstFourItems = data.slice(0, 4);





    if (resources) {
        // Extraer el tipo de cada recurso
        const types = resources.map(resource => resource.resource_type);

        function groupResourcesByType(resources) {
            const groupedResources = {};
            resources.forEach(resource => {
                const resourceType = resource.resource_type;
                if (!groupedResources[resourceType]) {
                    groupedResources[resourceType] = [];
                }
                groupedResources[resourceType].push(resource);
            });
            return groupedResources;
        }

        // Organizar los recursos por tipo
        const groupedResources = groupResourcesByType(resources);

        // Verificar los recursos organizados por tipo
        for (const resourceType in groupedResources) {
            console.log(`Recursos de tipo '${resourceType}':`);
            groupedResources[resourceType].forEach(resource => {
                console.log(resource);
            });
            console.log();
        }
    } else {
        console.log('resources is null or undefined');
    }

    // function mapItems(items) {
    //     return items.map(item => {
    //         const nombre = item.resource_type;
    //         const category = nombre ? nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    //         return category;
    //     });
    // }      

    // const category = mapItems(firstFourItems);




    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-2 justify-content-center">
                    <Col xs={11} md={6} lg={10}>
                        <h1 className="heading1">Recursos</h1>
                    </Col>
                </Row>
                <Row>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-2 align-items-center justify-content-center resources"
                    >
                        <Tab eventKey="article" title={<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}><img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Farticle.png?alt=media&token=c7baed85-7d3b-4f7a-abd2-f47bbea5a372" alt="Descripción de la imagen" style={{ width: '30vh', height: 'auto', maxWidth:'100%'}} /><span>Artículos</span></div>} className="resources">

                            <ul>
                                {store.resources
                                    .filter(item => {
                                        // Normalizar el tipo de recurso y comparar con "artículo"
                                        const normalizedType = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
                                        return normalizedType === 'articulo';
                                    })
                                    .slice(-5) // Cambia este número a la cantidad de elementos que quieres renderizar
                                    .map(item => {
                                        // Obtener el tipo de recurso normalizado para usar como clase CSS
                                        const category = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';

                                        return (
                                            <li key={item.id} className={category}>
                                                <a href={item.url} target="_blank" rel="noreferrer">
                                                    <div className="ms-2 me-auto">
                                                        <div className="fw-bold">{item.title}</div>
                                                        {item.description}
                                                    </div>
                                                </a>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </Tab>

                        <Tab eventKey="video" title={<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}><img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fvideo.png?alt=media&token=21e95df2-7c85-4df1-a08e-848f2ef1ddf9" alt="Descripción de la imagen" style={{ width: '30vh',  height: 'auto', maxWidth:'100%' }} /><span>Video</span></div>} className="resources">
                            <ul>
                                {store.resources
                                        .filter(item => {
                                            // Normalizar el tipo de recurso y comparar con "artículo"
                                            const normalizedType = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
                                            return normalizedType === 'video';
                                        })
                                        .slice(-5) // Cambia este número a la cantidad de elementos que quieres renderizar
                                        .map(item => {
                                            // Obtener el tipo de recurso normalizado para usar como clase CSS
                                            const category = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';

                                            return (
                                                <li key={item.id} className={category}>
                                                    <a href={item.url} target="_blank" rel="noreferrer">
                                                        <div className="ms-2 me-auto">
                                                            <div className="fw-bold">{item.title}</div>
                                                            {item.description}
                                                        </div>
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                            </ul>
                        </Tab>
                        <Tab eventKey="podcast" title={<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}><img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fpodcast.png?alt=media&token=d0ea6e38-b4a2-4816-8488-1a4e99de627e" alt="Descripción de la imagen" style={{ width: '30vh',  height: 'auto', maxWidth:'100%' }} /><span>Podcast</span></div>} className="resources" >
                            <ul>
                                {store.resources
                                        .filter(item => {
                                            // Normalizar el tipo de recurso y comparar con "artículo"
                                            const normalizedType = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
                                            return normalizedType === 'podcast';
                                        })
                                        .slice(-5) // Cambia este número a la cantidad de elementos que quieres renderizar
                                        .map(item => {
                                            // Obtener el tipo de recurso normalizado para usar como clase CSS
                                            const category = item.resource_type ? item.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';

                                            return (
                                                <li key={item.id} className={category}>
                                                    <a href={item.url} target="_blank" rel="noreferrer">
                                                        <div className="ms-2 me-auto">
                                                            <div className="fw-bold">{item.title}</div>
                                                            {item.description}
                                                        </div>
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
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
