import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

/* React boostrap */
import { Container, Row, Col } from 'react-bootstrap';

/* APP */
import { Context } from "../store/appContext";
import AccordionFaqs from "../component/accordeonFaqs";
import CallToAction from '../component/callToAction';


export const Faqs = () => {
    const { store, actions } = useContext(Context);

    return (
        <Container fluid className="mt-3 mb-3 py-5 container-landingpage">
            <div className="container-fluid landing-container">
                <h1 className="heading1 mt-3">Preguntas frecuentes</h1>
                <AccordionFaqs />
                <CallToAction
                    title1="¿Aún tienes"
                    title2="más dudas?"
                    text="Entendemos que cada usuario tiene necesidades únicas y estamos aquí para ayudarte. Si no encuentras la respuesta que buscas en nuestras FAQs o si deseas una guía más personalizada, no dudes en enviarnos un email. Nuestro equipo está comprometido a proporcionarte la ayuda que necesitas dentro de nuestra red social. ¡Escríbenos y te responderemos lo antes posible! Tu bienestar es nuestra prioridad."
                    buttonText="No lo dudes, ¡escríbenos!"
                    buttonUrl="mailto:mymood@gmail.com"
                />
            </div>

        </Container>
    );
};
