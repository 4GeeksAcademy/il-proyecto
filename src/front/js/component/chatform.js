import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";

function ChatForm() {
    const { socket } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Función para agrupar por día
    function groupMessagesByDay(conversation) {
        const groupedByDay = conversation.reduce((acc, message) => {
            // Asegúrate de que el timestamp es válido antes de convertirlo a fecha
            const dateObj = new Date(message.timestamp);
            if (isNaN(dateObj)) {
                console.error("Invalid date from timestamp", message.timestamp);
                return acc; // Continúa con el siguiente elemento si la fecha no es válida
            }
            // Formatear la fecha a Castellano
            const day = new Intl.DateTimeFormat('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);
            
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(message);
            return acc;
        }, {});

        return Object.keys(groupedByDay).map(day => ({
            day,
            messages: groupedByDay[day]
        }));
    }

    useEffect(() => {
        if (!socket) return;

        const handleId = (data) => {
            setCurrentUserId(data.id);
        };

        const handleMessage = (data) => {
            console.log("Received data in handleMessage:", data);
            if (!data.data || typeof data.data.message !== 'string') {
                console.error("Expected data.data.message to be a string, got:", data);
                return;  
            }
            const messageText = data.data.message;
            const enhancedMessage = linkify(messageText);
            const timestamp = new Date(data.data.timestamp);
            setConversation(prevConversation => [
                ...prevConversation,
                { message: enhancedMessage, id: data.id, timestamp }
            ]);
        };

        socket.connect();

        socket.on('your_id', handleId);
        socket.on('data', handleMessage);

        // Limpiar el evento al desmontar
        return () => {
            socket.off('data', handleMessage);
        };
    }, [socket]);

    function submitMessage(e) {
        if (e.key === "Enter" && message.trim()) {
            console.log("Sending message with timestamp:", { message, timestamp: new Date().toISOString() });
            socket.emit('data', { message, timestamp: new Date().toISOString() });
            setMessage("");
        }
    }

    function linkify(inputText) {
        if (typeof inputText !== 'string') {
            console.error('linkify function expected a string but received:', inputText);
            return inputText; // Retorna el input sin cambios si no es una cadena
        }
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return inputText.replace(urlRegex, function (url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });
    }

    const groupedMessages = groupMessagesByDay(conversation);

    return (
        <>
            <div className="chat">
                {groupedMessages.map(group => (
                    <div key={group.day} className="date">
                        <small>{group.day}</small>
                        <ul>
                            {group.messages.map((item, index) => (
                                <li key={index} className={item.id === currentUserId ? "my-message" : "other-message"}
                                    dangerouslySetInnerHTML={{ __html: `${item.id}: ${item.message}` }}>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <input type="text" placeholder="Message..." className="form-control my-input mt-3"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={submitMessage} />
            </div>
        </>
    );
}

export default ChatForm;


