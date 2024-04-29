import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/choose-mood.css";
import { Col, Container, Row, Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';


export const Mood = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();
    const [moods, setMoods] = useState([]);
    const [divStyles, setDivStyles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeMoods = async () => {
            setLoading(true);
            const aleatoryMoodsFromApi = await actions.getAllMoods();
            setMoods(aleatoryMoodsFromApi);
            calculateStyles(aleatoryMoodsFromApi);
            setLoading(false);
        };

        initializeMoods();
    }, []);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const isColorDark = (color) => {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    };

    const calculateStyles = (moods) => {
        const newStyles = moods.map((_, index) => {
            const backgroundColor = getRandomColor();
            const color = isColorDark(backgroundColor) ? 'white' : 'black';
            return {
                backgroundColor,
                color,
                position: 'relative',
                width: '100%',
                padding: '20px',
                marginTop: index === 0 ? '120px' : '20px',
                opacity: 0,
                animation: `fadeIn 1s ${index * 0.5}s forwards`
            };
        });
        setDivStyles(newStyles);
    };

    const handleMoodClick = async (moodId) => {
        const result = await actions.updateUserMood(store.user?.id, moodId);
        if (result) {
            navigate('/day-mood');
        } else {
            console.error('Failed to update mood');
        }
    };

    if (loading) {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col lg={4} md={12} xs={12} className="d-flex text-left align-items-center justify-content-center ">
                    <h1>Hola, {store.user?.name}<br /> ¿Cómo te sientes hoy?</h1>
                </Col>
                <Col lg={8} md={12} xs={12} id="body-mood">
                    <div className="container-choose-mood">
                        {moods.map((mood, index) => (
                            <div key={mood.mood_id}>
                                <Button
                                    className="dynamic-content"
                                    onClick={() => handleMoodClick(mood.mood_id)}
                                    style={divStyles[index] || {}}
                                >
                                    {mood.mood}
                                </Button>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Mood;
