import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Container} from "react-bootstrap";
import Mood from "../component/mood";



export const ChooseMood = () => {
    const { store, actions } = useContext(Context);
    
    console.log("CHUSMUDDDDDDDDDDDDDDDDDD",store?.active_users);
    return (
        <Container fluid className="container-landingpage vh-100">
            <Mood/>
        </Container>
    );
}

export default ChooseMood;

