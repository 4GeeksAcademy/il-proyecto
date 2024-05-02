import React from "react";
import { Container,} from "react-bootstrap";
import Mood from "../component/mood";

export const ChooseMood = () => {

    return (
        <Container fluid className="container-landingpage vh-100">
            <Mood/>
        </Container>
    );
}

export default ChooseMood;

