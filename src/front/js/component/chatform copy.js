import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";

function ChatForm() {
    const { socket, store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);




    // ************************************ROOMS// ************************************
    function joinChat(otherUserId) {
        const roomId = `chat_${Math.min(currentUserId, otherUserId)}_${Math.max(currentUserId, otherUserId)}`;
        socket.emit('join', { user_id: currentUserId, other_user_id: otherUserId });
        socket.off('receive_message');
        socket.on('receive_message', (data) => {
            if (data.room === roomId) {
                setConversation(prevConversation => [
                    ...prevConversation,
                    data
                ]);
            }
        });
    }

    // socket.on('joined_room', (data) => {
    //     console.log(`Joined room ${data.room}`);
    // });

    // socket.on('receive_message', (data) => {
    //     // Añadir el mensaje recibido al estado que maneja la conversación
    // });


    function sendMessage(message, roomId) {
        socket.emit('send_message', { message, sender_id: currentUserId, room: roomId });
    }


    function submitMessageRoom(e) {
        if (e.key === "Enter" && message.trim()) {
            const newMessage = {
                message: message,
                sender_id: currentUserId,
                timestamp: new Date().toISOString()
            };
            // Enviar el mensaje a la sala correcta.
            socket.emit('send_message', { ...newMessage, room: roomId });
            // Añadir el mensaje al estado para actualizar la UI inmediatamente.
            setConversation(prevConversation => [
                ...prevConversation,
                newMessage
            ]);
            setMessage("")
        }
    }

    function leaveChat(roomId) {
        socket.emit('leave', { room: roomId });
    }


    const handleUserClick = (otherUserId) => {
        const currentUserId = store?.user.id; // Asumiendo que el ID del usuario actual se almacena aquí
        const roomId = `chat_${Math.min(currentUserId, otherUserId)}_${Math.max(currentUserId, otherUserId)}`;

        setRoomId(roomId); // Establecer el roomId en el estado
        console.log("Joining room:", roomId, currentUserId, otherUserId);
        // Unir a la room
        joinChat(otherUserId);
        // socket.emit('join', { user_id: currentUserId, other_user_id: otherUserId });

        // Opcional: establecer el chat actual en el contexto para mostrar la interfaz de chat
        // setCurrentChat({
        //     roomId: roomId,
        //     otherUserId: otherUserId
        // });
    };

    useEffect(() => {
        actions.getAllUsers();
        if (!socket) return;

        socket.on('your_id', (data) => {
            setCurrentUserId(data.id);
        });

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

        socket.on('data', handleMessage);

        return () => {
            socket.off('data', handleMessage);
            socket.off('your_id');
        };
    }, [socket]);
    // ************************************// ************************************



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

    // useEffect(() => {
    //     if (!socket) return;

    //     const handleId = (data) => {
    //         setCurrentUserId(data.id);
    //     };

    //     const handleMessage = (data) => {
    //         console.log("Received data in handleMessage:", data);
    //         if (!data.data || typeof data.data.message !== 'string') {
    //             console.error("Expected data.data.message to be a string, got:", data);
    //             return;
    //         }
    //         const messageText = data.data.message;
    //         const enhancedMessage = linkify(messageText);
    //         const timestamp = new Date(data.data.timestamp);
    //         setConversation(prevConversation => [
    //             ...prevConversation,
    //             { message: enhancedMessage, id: data.id, timestamp }
    //         ]);
    //     };

    //     socket.connect();

    //     // socket.on('your_id', handleId);
    //     socket.on('data', handleMessage);
    //     socket.on('send_message_chat', handleMessage);
    //     // Limpiar el evento al desmontar
    //     return () => {
    //         socket.off('data', handleMessage);
    //         socket.off('send_message_chat', handleMessage);
    //     };
    // }, [socket]);


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


    useEffect(() => {
        actions.getAllUsers();
    }, []);

    return (
        <>
            <ul>
                {store?.all_users.map((item, index) => {
                    return (
                        <li key={index} onClick={() => handleUserClick(item.id)}>
                            {item.name}<span className={`${item.is_active ? 'active' : 'inactive'}`}> &#9673; </span>
                        </li>
                    );
                })}
            </ul>

            {roomId && (
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
                        onKeyDown={submitMessageRoom} />
                </div>
            )}

            {/* <div className="chat">
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
            </div> */}
        </>
    );
}

export default ChatForm;


