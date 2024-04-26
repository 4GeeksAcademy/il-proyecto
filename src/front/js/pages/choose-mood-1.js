import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/choose-mood.css";
import { Col, Container, Row } from "react-bootstrap";

export const ChooseMood = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState(null);
    const [botones, setBotones] = useState([]);
    const [mood, setMood] = useState({normal: "",leve: "",moderado: "",severo: "",extremo: ""});

       
    useEffect(() => {
        const fetchMoods = async () => {
          try {
            const result = await actions.getAllMoods();
      
            if (result && result.results) {
              const updatedMood = {
                Extremo: result.results.Extremo && result.results.Extremo.length > 0 ? result.results.Extremo[Math.floor(Math.random() * result.results.Extremo.length)] : '',
                Leve: result.results.Leve && result.results.Leve.length > 0 ? result.results.Leve[Math.floor(Math.random() * result.results.Leve.length)] : '',
                Normal: result.results.Normal && result.results.Normal.length > 0 ? result.results.Normal[Math.floor(Math.random() * result.results.Normal.length)] : '',
                Severo: result.results.Severo && result.results.Severo.length > 0 ? result.results.Severo[Math.floor(Math.random() * result.results.Severo.length)] : '',
                Moderado: result.results.Moderado && result.results.Moderado.length > 0 ? result.results.Moderado[Math.floor(Math.random() * result.results.Moderado.length)] : ''
              };
              setMood(updatedMood);
            }
          } catch (error) {
            console.error('Error al obtener las frases de los estados de ánimo:', error);
          }
        };  
        fetchMoods();
      }, []);
      

      useEffect(() => {
        console.log(mood);
      }, [mood]);
      
      
    
      window.onload = function() {
        const divs = document.querySelectorAll('.dynamic-content');
        const container = document.querySelector('.container-choose-mood');
        let totalHeight = 0;
    
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    
        function isColorDark(color) {
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance < 0.5;
        }
          
        
        divs.forEach((div) => {
            
            const parentDiv = document.getElementById('body-mood');
            const parentDivHeight = parentDiv.offsetHeight;// Se agrega el margen arriba y abajo
            totalHeight += parentDivHeight // Se agrega el margen arriba y abajo

            const backgroundColor = getRandomColor();
            div.style.backgroundColor = backgroundColor;
            div.style.color = isColorDark(backgroundColor) ? 'white' : 'black';
        });
    
        // Calcular la altura del texto y ajustar el margen superior del contenedor
        // const text = document.createElement('p');
        // text.innerHTML = '¿Cómo<br> te sientes hoy?';
        // text.style.marginRight = '50%';
        // text.style.fontSize = '3.5em';
        // container.appendChild(text);
        // const textHeight = text.offsetHeight;
        // totalHeight += textHeight + 20; // Se agrega el margen arriba y abajo para el texto
    
        container.style.height = `${totalHeight}vh`;
    
        const containerWidth = container.offsetWidth;
        let lastBottomPosition = totalHeight;
    
        const slideInAnimation = `
            @keyframes slide-in {
                to { left: 0; }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = slideInAnimation;
        document.head.appendChild(styleSheet);
    
        divs.forEach((div, index) => {
            const divHeight = div.offsetHeight;
            let divTopPosition;
    
            divTopPosition = lastBottomPosition - divHeight - 40; // Se agrega el margen arriba y abajo
    
            lastBottomPosition = divTopPosition + 10;
    
            const divLeftPosition = (containerWidth - div.offsetWidth) / 2;
    
            const keyframes = `
                @keyframes fall-div${index} {
                    to { top: ${divTopPosition}px; left: ${divLeftPosition}px; }
                }
            `;
    
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = keyframes;
            document.head.appendChild(styleSheet);
    
            div.style.position = 'absolute';
            div.style.left = `${divLeftPosition}px`;
            div.style.animationName = `fall-div${index}`;
            div.style.animationDuration = "5s";
            div.style.animationFillMode = "forwards";
            div.style.animationDelay = `${index}s`;
        });
    };
    
    
    

// window.onload = function() {
//     const divs = document.querySelectorAll('.dynamic-content');
//     const container = document.querySelector('.container-choose-mood');
//     let totalHeight = 0;

//     function getRandomColor() {
//         const letters = '0123456789ABCDEF';
//         let color = '#';
//         for (let i = 0; i < 6; i++) {
//             color += letters[Math.floor(Math.random() * 16)];
//         }
//         return color;
//     }

//     function isColorDark(color) {
//         const r = parseInt(color.substr(1, 2), 16);
//         const g = parseInt(color.substr(3, 2), 16);
//         const b = parseInt(color.substr(5, 2), 16);
//         const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//         return luminance < 0.5;
//     }

//     divs.forEach((div) => {
//         totalHeight += div.offsetHeight + 10;

//         const backgroundColor = getRandomColor();
//         div.style.backgroundColor = backgroundColor;
//         div.style.color = isColorDark(backgroundColor) ? 'white' : 'black';
//     });

//     container.style.height = `${totalHeight}px`;

//     const containerWidth = container.offsetWidth;
//     let lastBottomPosition = totalHeight;

//     const text = document.createElement('p');
//     text.innerHTML = '¿Cómo<br> te sientes hoy?';
//     text.style.marginLeft = '5%';
//     text.style.position = 'absolute';
//     text.style.left = '-100%';
//     text.style.top = '50%';
//     text.style.transform = 'translateY(-50%)';
//     text.style.fontSize = '3.5em';
//     text.style.animation = 'slide-in 2s forwards';
//     container.appendChild(text);

//     const slideInAnimation = `
//         @keyframes slide-in {
//             to { left: 0; }
//         }
//     `;
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = slideInAnimation;
//     document.head.appendChild(styleSheet);

//     divs.forEach((div, index) => {
//         const divHeight = div.offsetHeight;
//         let divTopPosition;

//         divTopPosition = lastBottomPosition - divHeight - 10;

//         lastBottomPosition = divTopPosition;

//         const divLeftPosition = (containerWidth - div.offsetWidth) / 2;

//         const keyframes = `
//             @keyframes fall-div${index} {
//                 to { top: ${divTopPosition}px; left: ${divLeftPosition}px; }
//             }
//         `;

//         const styleSheet = document.createElement("style");
//         styleSheet.type = "text/css";
//         styleSheet.innerText = keyframes;
//         document.head.appendChild(styleSheet);

//         div.style.position = 'absolute';
//         div.style.left = `${divLeftPosition}px`;
//         div.style.animationName = `fall-div${index}`;
//         div.style.animationDuration = "5s";
//         div.style.animationFillMode = "forwards";
//         div.style.animationDelay = `${index}s`;
//     });
// };




    return (
        <>
            <Container fluid className="container-landingpage">
                <Container className="vh-100">
                    <Row>
                        <Col lg={4} md={12} xs={12}>
                            <h1>¿Cómo te sientes hoy?</h1>
                        </Col>

                        <Col lg={8} md={12} xs={12} id="body-mood">
                            <div className="container-choose-mood">
                                <div className="dynamic-content" id="div1">{mood.Normal?.mood}</div>
                                <div className="dynamic-content" id="div2">{mood.Leve?.mood}</div>
                                <div className="dynamic-content" id="div3">{mood.Moderado?.mood}</div>
                                <div className="dynamic-content" id="div4">{mood.Severo?.mood}</div>
                                <div className="dynamic-content" id="div5">{mood.Extremo?.mood}</div>
                            </div>
                        </Col>
                    </Row>

                </Container>
                {/* <div className="container-choose-mood">
                    <div className="dynamic-content" id="div1">{mood.Normal?.mood}</div>
                    <div className="dynamic-content" id="div2">{mood.Leve?.mood}</div>
                    <div className="dynamic-content" id="div3">{mood.Moderado?.mood}</div>
                    <div className="dynamic-content" id="div4">{mood.Severo?.mood}</div>
                    <div className="dynamic-content" id="div5">{mood.Extremo?.mood}</div>
                </div> */}
            </Container>
        </>
    );
};

export default ChooseMood;
