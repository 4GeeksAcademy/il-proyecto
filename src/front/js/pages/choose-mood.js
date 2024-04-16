import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { getUsernameFromServer } from "../store/flux";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            const username = await getUsernameFromServer();
            setUsername(username);
        };
        fetchUsername();
    }, []);

    const handleButtonClick = async (estado) => {
        try {
            // Guardar el estado en el servidor
            await guardarEstadoEnServidor(estado);
            // Redireccionar a la página "demo"
            window.location.href = "demo";
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error si es necesario
        }
    };

    return (
        <div className="text-center mt-5">
            <h1>{username ? `${username}, ¿cómo estás hoy?` : "¿Cómo estás hoy?"}</h1>
            <div className="opciones">
                {/* Cada botón pasa el estado correspondiente a la función handleButtonClick */}
                <button onClick={() => handleButtonClick('feliz')}>Feliz</button>
                <button onClick={() => handleButtonClick('triste')}>Triste</button>
                <button onClick={() => handleButtonClick('enfadado')}>Enfadado</button>
                <button onClick={() => handleButtonClick('meh')}>Meh</button>
                <button onClick={() => handleButtonClick('estresado')}>Estresado</button>
            </div>
        </div>
    );
};
