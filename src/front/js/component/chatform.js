import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";
import { socket } from "../store/appContext";
import { set } from "firebase/database";


function ChatForm({ userName, setShowChatModal }) {
    const { store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);
    const [name, setName] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    const [otherUserName, setOtherUserName] = useState(null); // Estado para almacenar el nombre del receptor

   


    function submitMessageRoom(e) {
        console.log("JOIN ROOM 5");
        if (e.key === "Enter" && message.trim()) {
            console.log("Sending message with timestamp:", { message, timestamp: new Date().toISOString() });
            console.log("DENTRO DEL IF");
            const newMessage = {
                message: message,
                sender_id: store?.user.id,
                sender_name: store?.user.name,
                timestamp: new Date(),
                room: store.room,
                isSender: true,
                recipient_id: userName,
                
            };
            setRoomId(store.room);
            console.log("SALAAAA ", store.room);
            console.log(otherUserName);
            console.log(newMessage);
            // socket.emit('data', { newMessage });
            socket.emit('data', { newMessage, room: store.room })
             setMessage("");
            console.log(conversation);
            console.log("JOIN ROOM 6 hemos pasado el send message");

        }}

        // const handleId = (data) => {
        //     setCurrentUserId(data.sender_id);};
        //     setOtherUserName(userName);
    
    
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
            // const room = store.room;
            console.log(enhancedMessage, timestamp);
            // Crear un nuevo objeto de mensaje
            const userMessage = {
                message: enhancedMessage,
                sender_id: data.data.sender_id,
                sender_name: data.data.newMessage.sender_name,
                timestamp: timestamp,
                room: store.room,
                isSender: data.data.newMessage.sender_id === currentUserId,
                recipient_id: userName,
                other_user_name: userName,
            };
            
           
            // Actualizar el estado de conversation
            setConversation(prevConversation => [...prevConversation, userMessage]);
        };



    useEffect(() => {
        actions.getAllUsers();
        if (!socket) return;

        const handleId = (data) => {
                setCurrentUserId(data.sender_id);};
                setOtherUserName(userName);
        

        // const handleRoomJoined = (data) => {
        //     // Extraer el ID de la sala de los datos recibidos
        //     const roomIdFromData = roomId;
        //     // Establecer el estado roomId con el ID de la sala
        //     setRoomId(roomIdFromData);
        // };

        // const handleRoomJoined = (data) => {
        //     console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data); // Imprimir los datos recibidos
        // };

        // handleRoomJoined();
        // socket.on('room_join', handleRoomJoined);
        

        // problema puede ser que este AQUI

        // const handleRoomJoined = (data) => setRoomId(data.room);
        // const handleRoomJoined = (data) => setRoomId(store?.room);
        // handleRoomJoined();
        // const handleRoomJoined = (data) => setRoomId(data.roomId);

        // console.log("handle ROOM HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", roomId);
        // // socket.on('room_joined', roomId);        
        // socket.on('room_joined', (data) => {
        //     // Update roomId state
        //     setRoomId(data.roomId);
        // });
        
        
        // handleMessage();
        // const handleMessage = (data) => {
        //     console.log("Received data in handleMessage:", data);
        //     // Cambiar aquí para acceder a data.data.newMessage
        //     if (!data.data.newMessage || typeof data.data.newMessage.message !== 'string') {
        //         console.error("Expected data.newMessage.message to be a string, got:", data);
        //         return;
        //     }
        //     const messageText = data.data.newMessage.message;  // Accede a través de data.data.newMessage
        //     const enhancedMessage = linkify(messageText);
        //     const timestamp = new Date(data.data.newMessage.timestamp);  // y data.data.newMessage.timestamp
        //     // const room = store.room;
        //     console.log(enhancedMessage, timestamp);
        //     // Crear un nuevo objeto de mensaje
        //     const userMessage = {
        //         message: enhancedMessage,
        //         sender_id: data.data.sender_id,
        //         sender_name: data.data.newMessage.sender_name,
        //         timestamp: timestamp,
        //         room: store.room,
        //         isSender: data.data.newMessage.sender_id === currentUserId,
        //         other_user_name: userName,
                
        //     };
            
           
        //     // Actualizar el estado de conversation
        //     setConversation(prevConversation => [...prevConversation, userMessage]);
        // };

            console.log("SALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA CLIENTE", store.room);
            socket.connect();
            socket.on('your_id', handleId);
            // socket.on('room_joined', handleRoomJoined);
            socket.on('data', handleMessage);
            // socket.connect();
            // socket.on('your_id', handleId);
            // socket.on('private_message', handleMessage);           
    
        return () => {
            // socket.off('private_message', handleMessage);
            // socket.off('data', handleMessage);
            // socket.off('room_joined', handleRoomJoined);
            // socket.emit('leave_room', { userId: currentUserId, roomId: roomId });
            // socket.disconnect();
        }
    }, [socket]);


    // useEffect(() => {
    //     console.log(roomId);
    // }, [roomId]);



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
            // Utiliza el nombre del remitente del mensaje en lugar del sessionStorage
            const messageWithSenderName = { ...message };
            acc[day].push(messageWithSenderName);
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

    const handleCloseChatModal = () => {
        // socket.off('data', handleMessage);
        // socket.off('room_joined', handleRoomJoined);
        // socket.emit('leave_room', { userId: currentUserId, roomId: roomId });
        socket.off('data', handleMessage);
        socket.emit('leave_room', { userId: currentUserId, roomId: roomId });
        // socket.off('leave_room', { userId: currentUserId, roomId: roomId });
        // socket.disconnect();
        setShowChatModal(false);
      };

    // onClick={handleCloseChatModal}
  
    return (
        <>
                <div className="chat">
                        <h4 className='base-paragrahp'>Chatea con {userName}</h4><button className='button-login' onClick={handleCloseChatModal} >
                        Cancelar
                    </button>
                    {groupedMessages.map(group => (
                        <div key={group.day} className="date">
                            <small>{group.day}</small>
                            <ul>
                                {group.messages.map((item, index) => (
                                    <li key={index} className={item.sender_name === userName ? "my-message" : "other-message"}
                                    dangerouslySetInnerHTML={{ __html: `${item.sender_name}: ${item.message}` }}>
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
        </>
    );
}

export default ChatForm;


