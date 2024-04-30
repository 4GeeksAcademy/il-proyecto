import React, { useContext, useEffect, useState } from "react";
import "../../styles/day-mood.css";
import Container from 'react-bootstrap/Container';
import DailyMood from "../component/dailyMood";

export const DayMood = () => {

    return (
        <Container fluid className="container-landingpage">
            <DailyMood/>
        </Container>
    );
};

export default DayMood;
