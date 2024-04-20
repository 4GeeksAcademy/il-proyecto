import React, { useEffect, useRef } from 'react';

export const MoodMeh = () => {
    const svgRef = useRef(); // Referencia al elemento SVG
    const foreignObjectRef = useRef(); // Referencia al elemento foreignObject

    // Frases de estado de ánimo "meh"
    const frasesMeh = [
        "No sé ni cómo me siento",
        "Estoy desganado",
        "Nada me motiva",
        "Todo me da igual",
        "No tengo ánimos para nada",
        "Ni frío ni calor",
        "Siento un vacío",
        "Estoy en modo automático",
        "No sé qué hacer",
        "Estoy en una neblina emocional"
    ];

    useEffect(() => {
        const svg = svgRef.current;
        const foreignObject = foreignObjectRef.current;
        const div = foreignObject.querySelector('div');

        // Elegir una frase aleatoria de la lista
        const randomIndex = Math.floor(Math.random() * frasesMeh.length);
        const fraseAleatoria = frasesMeh[randomIndex];

        // Actualizar el contenido de la div con la frase aleatoria
        div.innerHTML = fraseAleatoria;

        // Usar una función asíncrona dentro de useEffect
        setTimeout(() => {
            let rectHeight = div.offsetHeight + 20; // Agrega tu padding deseado aquí
            svg.setAttribute('height', rectHeight + 40); // Ajusta según necesites espacio para la sombra
            foreignObject.setAttribute('height', rectHeight);
            svg.querySelector('rect').setAttribute('height', rectHeight);
        }, 0);
    }, []);

    return (
        <svg ref={svgRef} width="350" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-10%" y="-10%" width="150%" height="150%">
                    <feDropShadow dx="10" dy="10" stdDeviation="0" floodColor="black" />
                </filter>
            </defs>
            <rect x="10" y="10" width="330" height="150" rx="15" ry="15"
                fill="#FF5E41" stroke="black" strokeWidth="4"
                filter="url(#shadow)" />
            <foreignObject ref={foreignObjectRef} x="10" y="10" width="330" height="150">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '40px', fontFamily: 'Arial Black', fontWeight: '900', padding: '20px', boxSizing: 'border-box', whiteSpace: 'pre-wrap', color: '#FAB6DB', lineHeight: 1}}>
                    {/* La frase se insertará dinámicamente aquí */}
                </div>
            </foreignObject>
        </svg>
    );
};

export default MoodMeh;
