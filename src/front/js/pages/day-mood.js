import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/day-mood.css";
import Container from 'react-bootstrap/Container';
import DailyMood from "../component/dailyMood";

export const DayMood = () => {
    const { store, actions } = useContext(Context);
    console.log("DAYMOOOOOOOOOOOOOOOOD",store?.active_users);
    console.log("CURRENT USER",store?.user);
    return (
        <Container fluid className="container-landingpage">
            <DailyMood/>
        </Container>
    );
};

export default DayMood;
