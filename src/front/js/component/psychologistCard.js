import React from "react";
import { useNavigate } from "react-router-dom";

/* MY MOOD STYLES */
import "../../styles/psychologist_card.css";

/* REACT-BOOSTRAP */
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

const PsychologistCard = ({ id, name, surnames, col_num, image }) => {
    const navigate = useNavigate();
    const handleProfileClick = (id) => {
        navigate(`/psychologist/${id}`);
    };

    return (
            <Card className="ps-card">
                <Card.Header className="bg-white"><Image src={image} className="ps-image" roundedCircle /></Card.Header>
                <Card.Body>
                    <Card.Title>{name} {surnames}</Card.Title>
                    <Card.Text>
                    [nº. {col_num} ]
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white"><button className="btn btn-dark rounded-pill" onClick={() => handleProfileClick(id)}>Ver perfil &rarr;</button></Card.Footer>
            </Card>
    );
};

export default PsychologistCard;
