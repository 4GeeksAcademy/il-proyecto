import React from 'react';
import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap"

// Definición del componente CallToAction
const CallToAction = ({ title1, title2, text, buttonText, buttonUrl }) => {
    return (
        <>
            <Container fluid className="mt-5 mb-5">
                <Row className="cta-container">
                    <Col><h1 className="heading1">{title1} <span className="heading2">{title2}</span></h1>
                        <p className="base-paragrahp">{text}</p>
                        <Link to={buttonUrl}>
                            <button className="cta-button">{buttonText}</button>
                        </Link></Col>
                </Row>
            </Container>
        </>
    );
};

export default CallToAction;
