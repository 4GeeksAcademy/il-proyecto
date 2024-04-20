import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import MoodFeliz from "../component/moodFeliz";
import MoodTriste from "../component/moodTriste";
import MoodEnfadado from "../component/moodEnfadado";
import MoodMeh from "../component/moodMeh";
import MoodEstresado from "../component/moodEstresado";
import "/workspaces/il-proyecto/src/front/styles/chooseMood.css"; 

export const ChooseMood = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState(null);
    const [botones, setBotones] = useState([]);


    useEffect(() => {

            // orden aleatorio inicial de los botones
            const botonesIniciales = [
                <MoodFeliz mood="feliz" />,
                <MoodTriste mood="triste" />,
                <MoodEnfadado mood="enfadado" />,
                <MoodMeh mood="meh" />,
                <MoodEstresado mood="estresado" />
            ];
            setBotones(generarOrdenAleatorio(botonesIniciales));
    }, []);

    const handleButtonClick = async (estado) => {
        try {
            await actions.saveMood(estado); 
            console.log('Estado de ánimo guardado correctamente');
            // Redirigir a la página "demo"
            window.location.href = "/map";
        } catch (error) {
            console.error('Error al guardar el estado de ánimo:', error);
        }
    };

    // Orden aleatorio de los botones
    const generarOrdenAleatorio = (array) => {
        const arrayCopia = [...array];
        for (let i = arrayCopia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopia[i], arrayCopia[j]] = [arrayCopia[j], arrayCopia[i]];
        }
        return arrayCopia;
    };

    console.log('vino')
    console.log(sessionStorage.userData)

    const name = JSON.parse(sessionStorage.userData).name;
    console.log(name)

    return (
        <div className="container-fluid container-landingpage">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="heading1">
                        {name ? <strong>{name}</strong> : null}
                        <em>{name ? ', ' : null}¿cómo te sientes hoy?</em>
                    </h1>
                </div>
            </div>
            <div className="row justify-content-center">
                {botones.map((boton, index) => (
                    <div key={index} className="col-md-4 col-sm-6 col-12 mb-3">
                        <div className="opciones text-center">
                            <div onClick={() => handleButtonClick(boton.props.mood)} className="boton-movil">
                                {boton}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChooseMood;
