import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { getPhycologyst } from "../store/flux"; // Importa la función getPhycologyst
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export const Phycologyst = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [phycologyst, setPhycologyst] = useState([]); 

    useEffect(() => {
        actions.getPhycologyst().then(res => {
            if (res) {
                setPhycologyst(res.results); // Actualiza el estado con los datos obtenidos desde el arreglo results
            }
        }).catch(error => {
            console.error('Error fetching or processing phycologyst data:', error);
        });
    }, []);

    const handleProfileClick = (psychologistId) => {
        navigate(`/phycologyst-profile/${psychologistId}`); // Redirige al perfil del psicólogo específico
    };

    return (
        <Container fluid className="container-landingpage">
            <h1>Conecta con un psicólogo</h1>
            <Row xs={1} md={2} lg={4} xl={4} className="g-4">
                {phycologyst.map((psychologist, index) => (
                    <Col key={index}>
                        <Card style={{ height: "100%" }}>
                            <div className="ps-card p-3">
                                <Image src={psychologist.profile_url} className="img-mood" roundedCircle />
                                <h5 style={{ color: 'black' }}>{psychologist.name} {psychologist.surnames}</h5>
                                <p><small style={{ color: 'black' }}> [nº. {psychologist.collegiate_number} ]</small></p>
                                <button className="btn btn-dark rounded-pill" onClick={() => handleProfileClick(psychologist.id)}>Ver perfil &rarr;</button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Phycologyst;
