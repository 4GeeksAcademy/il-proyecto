import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";
import { socket } from "../store/appContext";
import { set } from "firebase/database";


function ChatForm() {
    const { store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);
    const [name, setName] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    

      
    function submitMessageRoom(e) {
        console.log("JOIN ROOM 5");
        if (e.key === "Enter" && message.trim()) {
            console.log("Sending message with timestamp:", { message, timestamp: new Date().toISOString() });
            console.log("DENTRO DEL IF");
            const newMessage = {
                message: message,
                sender_id: store?.user.id,
                timestamp: new Date(),
                room: roomId,
                // other_user_id: 3
            };
            console.log(newMessage);
            socket.emit('data', { newMessage });
            setMessage("");
            console.log(conversation);
            console.log("JOIN ROOM 6 hemos pasado el send message");

        }}



    useEffect(() => {
        actions.getAllUsers();
        if (!socket) return;

        const handleId = (data) => {
                setCurrentUserId(data.sender_id);};

        const handleMessage = (data) => {
            console.log("Received data in handleMessage:", data);
            // Cambiar aquí para acceder a data.data.newMessage
            if (!data.data.newMessage || typeof data.data.newMessage.message !== 'string') {
                console.error("Expected data.newMessage.message to be a string, got:", data);
                return;
            }
            const messageText = data.data.newMessage.message;  // Accede a través de data.data.newMessage
            const enhancedMessage = linkify(messageText);
            const timestamp = new Date(data.data.newMessage.timestamp);  // y data.data.newMessage.timestamp
            const room = data.data.newMessage.room;
            console.log(enhancedMessage, timestamp);
            // Crear un nuevo objeto de mensaje
            const userMessage = {
                message: enhancedMessage,
                sender_id: data.data.newMessage.sender_id,
                timestamp: timestamp,
                room: room,
                // other_user_id: 2
            };
        
            // Actualizar el estado de conversation
            setConversation(prevConversation => [...prevConversation, userMessage]);
        };

            socket.connect();
            socket.on('your_id', handleId);
            socket.on('connect', function() {
                console.log('Connected to the server.');
                socket.emit('join_room', { userId: currentUserId, roomId: roomId });
            });
  
            socket.on('data', handleMessage);

        return () => {

            socket.off('data', handleMessage);

        }
    }, [socket]);



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
        console.log(groupedByDay);
        return Object.keys(groupedByDay).map(day => ({
            day,
            messages: groupedByDay[day]
        }));
    }

    const groupedMessages = groupMessagesByDay(conversation) ;
   
 
// Función para convertir las URLs en enlaces
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


  
    return (
        <>
        {/* {!roomId && (	 */}
            {/* <div>
            <ul>
                {store?.all_users.map((item, index) => {
                    return (
                        <li key={index} onClick={() => handleUserClick(item.id)}>
                            {item.id} / {item.name}<span className={`${item.is_active ? 'active' : 'inactive'}`}> &#9673; </span>
                        </li>
                    );
                })}
            </ul>
            </div>
        )} */}

            {/* {roomId && ( */}
                <div className="chat">
                    {groupedMessages.map(group => (
                        <div key={group.day} className="date">
                            <small>{group.day}</small>
                            <ul>
                                {group.messages.map((item, index) => (
                                    <li key={index} className={item.sender_id === currentUserId ? "my-message" : "other-message"}
                                        dangerouslySetInnerHTML={{ __html: `${item.sender_id}: ${item.message} ` }}>
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
            {/* )} */}
        </>
    );
}

export default ChatForm;


