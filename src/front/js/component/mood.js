import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import Modal024 from "./modal024";
import { useNavigate } from "react-router-dom";
import "../../styles/choose-mood.css";

export const Mood = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [divStyles, setDivStyles] = useState([]);
    const [showModal, setShowModal] = useState(false); // State para controlar la visibilidad del modal
    const [selectedMood, setSelectedMood] = useState(null); // State para almacenar el mood seleccionado

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
        const colors = [
            "var(--option1-color)",
            "var(--option2-color)",
            "var(--option3-color)",
            "var(--option4-color)",
            "var(--option6-color)",
            "var(--option67-color)"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
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
            let textColor = 'black';
            if (backgroundColor === 'var(--option5-color)' || backgroundColor === 'var(--option2-color)') {
                textColor = 'white';
            } else {
                textColor = isColorDark(backgroundColor) ? 'white' : 'black';
            }
            return {
                backgroundColor,
                color: textColor,
                // position: 'relative',
                // width: '100%',
                // padding: '20px',
                marginTop: index === 0 ? '120px' : '20px',
                opacity: 0,
                // animation: `fadeIn 1s ${index * 0.5}s forwards`
            };
        });
        setDivStyles(newStyles);
    };

    const handleMoodClick = async (moodId) => {
        if (moodId >= 40 && moodId <= 50) {
            setSelectedMood(moodId);
            setShowModal(true);
        } else {
            const result = await actions.updateUserMood(store.user?.id, moodId);
            if (result) {
                navigate('/day-mood');
            } else {
                console.error('Failed to update mood');
            }
        }
    };

    const handleCloseModal = async () => {
        setShowModal(false);
        if (selectedMood && selectedMood >= 0 && selectedMood <= 50) {
            const result = await actions.updateUserMood(store.user?.id, selectedMood);
            if (result) {
                navigate('/day-mood');
            } else {
                console.error('Failed to update mood');
            }
        }
    };

    if (loading) {
        return (
            <div className="vh-100 h-75">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }





    return (
        <Container fluid className="">
                <Row md={12} xs={12} className="d-flex text-center align-items-center justify-content-center ">
                    <h2>{JSON.parse(sessionStorage.getItem('userData')).name},</h2> <h1>¿Cómo te sientes hoy?</h1> 
                </Row>
            {/* <Row>
                <Col lg={4} md={12} xs={12} className="d-flex text-left align-items-center justify-content-center ">
                    <h1>Hola, {JSON.parse(sessionStorage.getItem('userData')).name}<br /> ¿Cómo te sientes hoy?</h1>
                </Col>
                <Col lg={8} md={12} xs={12} id="body-mood">
                    <div className="container-choose-mood">
                        {moods.map((mood, index) => (
                            <div key={mood.mood_id}>
                                <Button
                                    className={`dynamic-content option${index + 1} rounded-0`}
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
            {/* Modal */}
            {/* <Modal024
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                selectedMood={selectedMood}
            /> */}

            <Row className="d-flex justify-content-center align-items-center">
                <div className="main">
                    {moods.map((mood, index) => (
                        <div key={index} className={`chemin${index+1}`}>
                            <div className={`particle${index+1}`}></div>
                            <div className={`text-undertext {dynamic-content option${index + 1}`} onClick={() => handleMoodClick(mood.mood_id)} style={divStyles[index] || {}}>{mood.mood}</div>
                        </div>
                    ))}

                </div>


            </Row>
        </Container>





    );
}

export default Mood;


// <Row className="d-flex justify-content-center align-items-center">
// <div className="main">
//         <div className="chemin1">
//             <div className="particle1"></div>

//             <div className="text-undertext">Particle 1</div>
//         </div>
//         <div className="chemin2">
//             <div className="particle2"></div>

//             <div className="text-undertext">Particle 2</div>
//         </div>
//         <div className="chemin3">
//             <div className="particle3"></div>

//             <div className="text-undertextleft">Particle 3</div>
//         </div>
//         <div className="chemin4">
//             <div className="particle4"></div>

//             <div className="text-undertextleft">Particle 4</div>
//         </div>
//         <div className="chemin5">
//             <div className="particle5"></div>
//             <div className="text-undertext">Particle 5</div>
//         </div>
// </div>


// </Row>