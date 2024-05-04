import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/day-mood.css";
import { Container, Row, Col, Button, ButtonGroup, Spinner } from 'react-bootstrap';

export const DailyMood = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            await actions.getCurrentUser();
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const handleClickGeolocation = () => {
        navigate("/geolocation");
    };

    const handleClickResources = () => {
        navigate("/resources");
    };

    const handleClickpsychologist = () => {
        navigate("/psychologist");
    };

    const handleClickVolver = () => {
        navigate("/choose-mood");
    };

    if (isLoading) {

        return <div className="vh-100">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>;
    }

    if (!store.user || !store.user.user_mood) {
        return <div>No data available</div>; 
    }

    return (


        <Container className="user-profile vh-100">
            <Row className="mb-5">
                <Col xs={11} md={6} lg={10}>
                    <div className="orange-box">
                        <h1 className="">{store.user.user_mood?.mood}</h1>
                    </div>
                    <p className="base-paragrahp"> <strong>{JSON.parse(sessionStorage.getItem('userData')).name}: </strong> {store.user.user_mood?.response}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6} lg={9} className="d-flex justify-content-center align-items-center">
                    <ButtonGroup vertical className="actions-buttons">
                        {store.user?.user_mood.actions.map((action, index) => (
                            <Button
                                key={index}
                                className={`btn-block custom-border ${index === 2 ? "green" : ""}`}
                                size="lg"
                                onClick={() => {
                                    switch (index) {
                                        case 0:
                                            handleClickGeolocation();
                                            break;
                                        case 1:
                                            handleClickResources();
                                            break;
                                        case 2:
                                            handleClickpsychologist();
                                            break;
                                        // Agrega más casos según sea necesario
                                        default:
                                            break;
                                    }
                                }}
                            >
                                {action.action}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6} lg={9} className="d-flex justify-content-center">
                    <Button className="custom-button" size="lg" onClick={handleClickVolver}>
                        <span className="arrow">&#8592;</span> Volver
                    </Button>
                </Col>
            </Row>
        </Container>

    );
};

export default DailyMood;