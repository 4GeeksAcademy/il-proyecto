import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/day-mood.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export const DayMood = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getCurrentUser();
    }, []);
    
    if (!store.user || Object.keys(store.user).length === 0) {
        return null; 
    }
    
    // const { user } = store;
    // const { user_mood } = user;
    // const { response } = user_mood;
    // const userResponse = store.user.user_mood.response;
    // console.log(userResponse);

    // const { mood } = store.user.user_mood;



    const handleClickGeolocation = () => {
        // Redirigir a la página "geolocation"
        navigate("/geolocation");
    };

    const handleClickResources = () => {
        // Redirigir a la página "resources"
        navigate("/resources");
    };

    const handleClickUser = () => {
        // Redirigir a la página "user"
        navigate("/user");
    };

    // const handleClickPhycologyst = () => {
    //     // Redirigir a la página "psicologos"
    //     navigate("/phycologyst");
    // };

    const handleClickVolver = () => {
        // Redirigir a la página "choose-mood"
        navigate("/choose-mood");
    };


    return (
        <Container fluid className="container-landingpage">
            <Container className="user-profile">
                <Row className="mb-5">
                    <Col xs={11} md={6} lg={10}>
                        <div className="orange-box">
                            <h1 className="">el mooood</h1>
                        </div>
                        <p className="base-paragrahp"> {store.user.name},bla</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={9} className="d-flex justify-content-center align-items-center">
                        <ButtonGroup vertical className="actions-buttons">
                            {/* Botón con evento onClick para redirigir a la página geolocation */}
                            <Button className="btn-block custom-border orange" size="lg" onClick={handleClickGeolocation}>uno</Button>
                            {/* Botón con evento onClick para redirigir a la página resources */}
                            <Button className="btn-block custom-border pink" size="lg" onClick={handleClickResources}>dos</Button>
                            {/* Botón con evento onClick para redirigir a la página user */}
                            <Button className="btn-block custom-border green" size="lg" onClick={handleClickUser}>tres</Button>
                            {/* Botón con evento onClick para redirigir a la página psicologos */}
                            {/* <Button className="btn-block custom-border green" size="lg" onClick={handleClickphycologyst}>Hablar con un terapeuta</Button> */}
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} lg={9} className="d-flex justify-content-center">
                        {/* Botón adicional con evento onClick para redirigir a la página choose-mood */}
                        <Button className="custom-button" size="lg" onClick={handleClickVolver}>
                            <span className="arrow">&#8592;</span> Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default DayMood;

// {store.user ? store.user.user_mood.mood : ""}

// const { mood } = store.user.user_mood;
// <h1>{mood}</h1>;

// const userMood = store.user.user_mood.mood;
// <h1>{userMood}</h1>;




// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../store/appContext";
// import "../../styles/day-mood.css";
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';

// export const DayMood = () => {

//     const { store, } = useContext(Context);
    
//     useEffect(() => {
//     }, []);
    
//     if (!store.user || Object.keys(store.user).length === 0) {
//         return null; 
//     }
//     const { mood } = store.user.user_mood.mood;
//     const { response } = store.user.user_mood.response;
//     const { action } = store.user.user_mood.actions[0];
//     const { action } = store.user.user_mood.actions[1];
//     const { action } = store.user.user_mood.actions[2];
//     const { action } = store.user.user_mood.actions[3];
    
    
//     const handleClickGeolocation = () => {
//         // Redirigir a la página "geolocation"
//         navigate("/geolocation");
//     };

//     const handleClickResources = () => {
//         // Redirigir a la página "resources"
//         navigate("/resources");
//     };

//     const handleClickUser = () => {
//         // Redirigir a la página "user"
//         navigate("/user");
//     };

//     // const handleClickPhycologyst = () => {
//     //     // Redirigir a la página "psicologos"
//     //     navigate("/phycologyst");
//     // };

//     const handleClickVolver = () => {
//         // Redirigir a la página "choose-mood"
//         navigate("/choose-mood");
//     };


//     return (
//         <Container fluid className="container-landingpage">
//             <Container className="user-profile">
//                 <Row className="mb-5">
//                     <Col xs={11} md={6} lg={10}>
//                         <div className="orange-box">
//                             <h1 className="">{mood}</h1>
//                         </div>
//                         <p className="base-paragrahp"> {store.user.name},{response}</p>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col xs={12} md={6} lg={9} className="d-flex justify-content-center align-items-center">
//                         <ButtonGroup vertical className="actions-buttons">
//                             {/* Botón con evento onClick para redirigir a la página geolocation */}
//                             <Button className="btn-block custom-border orange" size="lg" onClick={handleClickGeolocation}>{user_mood.actions[0].action}</Button>
//                             {/* Botón con evento onClick para redirigir a la página resources */}
//                             <Button className="btn-block custom-border pink" size="lg" onClick={handleClickResources}>{user_mood.actions[1].action}</Button>
//                             {/* Botón con evento onClick para redirigir a la página user */}
//                             <Button className="btn-block custom-border green" size="lg" onClick={handleClickUser}>{user_mood.actions[2].action}</Button>
//                             {/* Botón con evento onClick para redirigir a la página psicologos */}
//                             {/* <Button className="btn-block custom-border green" size="lg" onClick={handleClickphycologyst}>{user_mood.actions[3].action}</Button> */}
//                         </ButtonGroup>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col xs={12} md={6} lg={9} className="d-flex justify-content-center">
//                         {/* Botón adicional con evento onClick para redirigir a la página choose-mood */}
//                         <Button className="custom-button" size="lg" onClick={handleClickVolver}>
//                             <span className="arrow">&#8592;</span> Volver
//                         </Button>
//                     </Col>
//                 </Row>
//             </Container>
//         </Container>
//     );
// };

// export default DayMood;