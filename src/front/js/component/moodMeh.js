import React, { useEffect, useRef } from 'react';
import { useState, useContext } from 'react';
import { Context } from '../store/appContext';

export const MoodMeh = () => {
    const svgRef = useRef(); // Referencia al elemento SVG
    const foreignObjectRef = useRef(); // Referencia al elemento foreignObject
    const { store, actions } = useContext(Context);
    const [fraseAleatoriaSevero, setfraseAleatoriaSevero] = useState(null);

    useEffect(() => {
        // Solo seleccionar una frase aleatoria si fraseAleatoriaSevero aún no se ha establecido
        if (!fraseAleatoriaSevero && store.mood && store.mood.Severo) {
            const randomIndex = Math.floor(Math.random() * store.mood.Severo.length);
            if (store.mood.Severo[randomIndex]) {
                setfraseAleatoriaSevero(store.mood.Severo[randomIndex].mood);
            }
        }
    }, [store.mood, fraseAleatoriaSevero]);  // Agregar fraseAleatoriaSevero como dependencia
    
    useEffect(() => {
        const svg = svgRef.current;
        const foreignObject = foreignObjectRef.current;
        const div = foreignObject.querySelector('div');
    
        if (fraseAleatoriaSevero) {
            div.innerHTML = fraseAleatoriaSevero;
        }
    
        setTimeout(() => {
            let rectHeight = div.offsetHeight + 20;
            svg.setAttribute('height', rectHeight + 40);
            foreignObject.setAttribute('height', rectHeight);
            svg.querySelector('rect').setAttribute('height', rectHeight);
        }, 0);
    }, [fraseAleatoriaSevero]);  // Agregar fraseAleatoriaLeve como dependencia



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
