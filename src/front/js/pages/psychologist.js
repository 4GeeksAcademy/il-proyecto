import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


/* MY MOOD CONPONENTS */
import PsychologistCard from "../component/psychologistCard";
import PsychologistCardSkeleton from "../component/skeleton/psychologistCardSkeleton"


/* REACT-BOOSTRAP */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Psychologist = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        actions.getAllPsychologist();
    }, []);
    

    return (
        <Container fluid className="container-landingpage">
           <Container>
            <h1 className="heading1">Conéctate con especialistas</h1>
            <h2 className="mb-3 text-center">En salud emocional</h2>
            <Row xs={1} md={2} lg={4} xl={4} className="g-3 mb-3">
            {/* <Row className="mb-3">     */}

                {loading ?
                    <>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col>
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col>
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                        <Col >
                            <PsychologistCardSkeleton />
                        </Col>
                    </>
                    : (
                        store?.allPsychologist.map((psychologist, index) => (
                            <Col  key={index}>
                                <PsychologistCard
                                    id={psychologist.id}
                                    name={psychologist.name}
                                    surnames={psychologist.surnames}
                                    col_num={psychologist.collegiate_number}
                                    image={psychologist.profile_url}
                                />
                            </Col>
                        ))
                    )}

            </Row>
            </Container>
        </Container>
    );
}

export default Psychologist;
