import React from "react";
import { Container,} from "react-bootstrap";
import Mood from "../component/mood";


export const ChooseMood = () => {

    return (
        <Container fluid className="container-landingpage">
            <Mood/>
        </Container>
    );
}

export default ChooseMood;

