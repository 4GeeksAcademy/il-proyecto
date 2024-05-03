import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; 

const Modal024 = ({ showModal, handleCloseModal, selectedMood }) => {
    const { store } = useContext(Context);
    const [userName, setUserName] = useState(""); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (store.user && store.user.name) {
            setUserName(store.user.name);
        }
    }, [store.user]);

    const handleCall024 = () => {
        window.location.href = 'tel:024';
    };
    
    const handleTalkToTherapist = () => {
        navigate('/psychologist');
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton style={{textAlign: 'left'}}>
                <Modal.Title className="heading1">{`${userName} ¿Te encuentras bien?`}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'left'}}>
                <p className="base-paragraph">No estás solo en esto. Podemos escucharte sin juicio. Juntos encontraremos el camino hacia un mañana más brillante. Tu vida importa, y estamos aquí para ayudarte a redescubrir su valor</p>
                <Button className='orange-box' onClick={handleCall024}>
                    Llamar 024
                </Button>
                <Button className='orange-box' onClick={handleTalkToTherapist}>
                    Hablar con un terapeuta
                </Button>
            </Modal.Body>
        </Modal>
    );
}

export default Modal024;
