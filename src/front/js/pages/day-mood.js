import React, { useEffect, useState }from "react";
import { useNavigate} from "react-router-dom";
import "../../styles/day-mood.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const DayMood = () => {
    // const name = JSON.parse(sessionStorage.userData).name;
    const [mood, setMood] = useState('');
    const [response, setResponse] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     // Realizar la solicitud al servidor para obtener el último mood y su respuesta
    //     fetch('/obtener_ultimo_mood') // Ruta para obtener el último mood del usuario, ajusta la ruta según tu configuración
    //         .then(response => response.json())
    //         .then(data => {
    //             // Actualizar el estado con el mood y la respuesta recibidos del servidor
    //             setMood(data.mood);
    //             setResponse(data.response);
    //         })
    //         .catch(error => {
    //             console.error('Error al obtener el último mood:', error);
    //         });
    // }, []);

    const handleClickGeolocation = () => {
        // Redirigir a la página "geolocation"
        navigate("/geolocation");
    };

    const handleClickResources = () => {
        // Redirigir a la página "resources"
        navigate("/resources");
    };

    const handleClickUser = () => {
        // Redirigir a la página "user"
        navigate("/user");
    };

    const handleClickVolver = () => {
        // Redirigir a la página "choose-mood"
        navigate("/choose-mood");
    };

    // const handleClickVolver = () => {
    //     // Redirigir a la página "psicologos"
    //     navigate("/psicologos");
    // };

    // const name = store.;

    // setusername(store.user.name)
    // console.log(name) 

    // const name = JSON.parse(sessionStorage.userId).name;
    // console.log(name)

    // const name = JSON.parse(sessionStorage.userId).mood;
    // console.log(mood)

    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <div className="orange-box">
                            <h1 className="">{mood}</h1>
                        </div>
                        <p className="base-paragrahp"> ,{response}</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={9} className="d-flex justify-content-center align-items-center">
                        <ButtonGroup vertical className="actions-buttons">
                            {/* Botón con evento onClick para redirigir a la página geolocation */}
                            <Button className="btn-block custom-border orange" size="lg" onClick={handleClickGeolocation}>Ver quien hay a mi alrededor</Button>
                            {/* Botón con evento onClick para redirigir a la página resources */}
                            <Button className="btn-block custom-border pink" size="lg" onClick={handleClickResources}>Ver un recurso</Button>
                            {/* Botón con evento onClick para redirigir a la página user */}
                            <Button className="btn-block custom-border green" size="lg" onClick={handleClickUser}>Ir a mi perfil</Button>
                            {/* Botón con evento onClick para redirigir a la página psicologos */}
                            <Button className="btn-block custom-border green" size="lg" onClick={handleClickPsicologos}>Hablar con un terapeuta</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={9} className="d-flex justify-content-center">
                        {/* Botón adicional con evento onClick para redirigir a la página choose-mood */}
                        <Button className="custom-button" size="lg" onClick={handleClickVolver}>
                            <span className="arrow">&#8592;</span> Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default DayMood;
