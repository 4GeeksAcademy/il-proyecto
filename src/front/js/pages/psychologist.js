import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

/* MY MOOD CONPONENTS */
import PsychologistCard from "../component/psychologistCard";

/* REACT-BOOSTRAP */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Psychologist = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getAllPsychologist();
    }, []);

    return (
        <Container fluid className="container-landingpage">
            <h1 className="heading1">Conéctate con especialistas</h1>
            <h2 className="mb-3">En salud emocional</h2>
            <Row xs={1} md={2} lg={4} xl={4} className="g-3 mb-3">
                {store?.allPsychologist.map((psychologist, index) => (
                    <Col key={index}>
                        <PsychologistCard
                            id={psychologist.id}
                            name={psychologist.name}
                            surnames={psychologist.surnames}
                            col_num={psychologist.collegiate_number}
                            image={psychologist.profile_url}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Psychologist;
