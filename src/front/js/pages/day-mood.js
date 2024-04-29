import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/day-mood.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const DayMood = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getCurrentUser();
    }, []);

    const handleClickGeolocation = () => {
        navigate("/geolocation");
    };

    const handleClickResources = () => {
        navigate("/resources");
    };

    const handleClickPhycologyst = () => {
        navigate("/phycologyst");
    };

    const handleClickVolver = () => {
        navigate("/choose-mood");
    };

    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <div className="orange-box">
                            <h1 className="">{store.user.user_mood?.mood}</h1>
                        </div>
                        <p className="base-paragrahp"> <strong>{store.user?.name}:</strong> {store.user.user_mood?.response}</p>
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
                                                handleClickPhycologyst();
                                                break;
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
        </Container>
    );
};

export default DayMood;
