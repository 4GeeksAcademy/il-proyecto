import React, { useEffect, useRef } from 'react';
import { useState, useContext } from 'react';
import { Context } from '../store/appContext';

export const MoodEnfadado = () => {
    const svgRef = useRef(); // Referencia al elemento SVG
    const foreignObjectRef = useRef(); // Referencia al elemento foreignObject
    const { store, actions } = useContext(Context);
    const [fraseAleatoriaNormal, setFraseAleatoriaNormal] = useState(null);


    useEffect(() => {
        actions.getAllMoods().then(() => {
            if (store.mood && store.mood.Normal) {
                console.log(store.mood.Normal);  // Aquí se imprimen todos los moods de la categoría "Normal"
            }
        });
    }, []);


    useEffect(() => {
        // Solo seleccionar una frase aleatoria si fraseAleatoriaNormal aún no se ha establecido
        if (!fraseAleatoriaNormal && store.mood && store.mood.Normal) {
            const randomIndex = Math.floor(Math.random() * store.mood.Normal.length);
            if (store.mood.Normal[randomIndex]) {
                setFraseAleatoriaNormal(store.mood.Normal[randomIndex].mood);
            }
        }
    }, [store.mood, fraseAleatoriaNormal]);  // Agregar fraseAleatoriaNormal como dependencia
    
    useEffect(() => {
        const svg = svgRef.current;
        const foreignObject = foreignObjectRef.current;
        const div = foreignObject.querySelector('div');
    
        if (fraseAleatoriaNormal) {
            div.innerHTML = fraseAleatoriaNormal;
        }
    
        setTimeout(() => {
            let rectHeight = div.offsetHeight + 20;
            svg.setAttribute('height', rectHeight + 40);
            foreignObject.setAttribute('height', rectHeight);
            svg.querySelector('rect').setAttribute('height', rectHeight);
        }, 0);
    }, [fraseAleatoriaNormal]);  // Agregar fraseAleatoriaNormal como dependencia



    return (
        <svg ref={svgRef} width="350" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-10%" y="-10%" width="150%" height="150%">
                    <feDropShadow dx="10" dy="10" stdDeviation="0" floodColor="black" />
                </filter>
            </defs>
            <rect x="10" y="10" width="330" height="150" rx="15" ry="15"
                fill="#D2F752" stroke="black" strokeWidth="4"
                filter="url(#shadow)" />
            <foreignObject ref={foreignObjectRef} x="10" y="10" width="330" height="150">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '40px', fontFamily: 'Arial Black', fontWeight: '900', padding: '20px', boxSizing: 'border-box', whiteSpace: 'pre-wrap', color: '#26547C', lineHeight: 1}}>
                    {/* La frase se insertará dinámicamente aquí */}
                </div>
            </foreignObject>
        </svg>
    );
};




    export default MoodEnfadado;
//     const [fraseAleatoriaNormal, setFraseAleatoriaNormal] = useState(null);


//     useEffect(() => {
//         actions.getAllMoods().then(() => {
//             if (store.mood && store.mood.Normal) {
//                 console.log(store.mood.Normal);  // Aquí se imprimen todos los moods de la categoría "Normal"
//             }
//         });
//     }, []);

 

//     useEffect(() => {
//         // Solo seleccionar una frase aleatoria si fraseAleatoriaNormal aún no se ha establecido
//         if (!fraseAleatoriaNormal && store.mood && store.mood.Normal) {
//             const randomIndex = Math.floor(Math.random() * store.mood.Normal.length);
//             if (store.mood.Normal[randomIndex]) {
//                 setFraseAleatoriaNormal(store.mood.Normal[randomIndex].mood);
//             }
//         }
//     }, [store.mood, fraseAleatoriaNormal]);  // Agregar fraseAleatoriaNormal como dependencia
    
//     useEffect(() => {
//         const svg = svgRef.current;
//         const foreignObject = foreignObjectRef.current;
//         const div = foreignObject.querySelector('div');
    
//         if (fraseAleatoriaNormal) {
//             div.innerHTML = fraseAleatoriaNormal;
//         }
    
//         setTimeout(() => {
//             let rectHeight = div.offsetHeight + 20;
//             svg.setAttribute('height', rectHeight + 40);
//             foreignObject.setAttribute('height', rectHeight);
//             svg.querySelector('rect').setAttribute('height', rectHeight);
//         }, 0);
//     }, [fraseAleatoriaNormal]);  // Agregar fraseAleatoriaNormal como dependencia



//     return (
//         <svg ref={svgRef} width="350" height="300" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//                 <filter id="shadow" x="-10%" y="-10%" width="150%" height="150%">
//                     <feDropShadow dx="10" dy="10" stdDeviation="0" floodColor="black" />
//                 </filter>
//             </defs>
//             <rect x="10" y="10" width="330" height="150" rx="15" ry="15"
//                 fill="#D2F752" stroke="black" strokeWidth="4"
//                 filter="url(#shadow)" />
//             <foreignObject ref={foreignObjectRef} x="10" y="10" width="330" height="150">
//                 <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '40px', fontFamily: 'Arial Black', fontWeight: '900', padding: '20px', boxSizing: 'border-box', whiteSpace: 'pre-wrap', color: '#26547C', lineHeight: 1}}>
//                     {/* La frase se insertará dinámicamente aquí */}
//                 </div>
//             </foreignObject>
//         </svg>
//     );
// };


