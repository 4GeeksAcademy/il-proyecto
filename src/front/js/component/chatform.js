import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";

function ChatForm() {
    const { socket, store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);


    function joinChat(otherUserId, roomId, currentUserId) {
        console.log("JOIN CHAT::"+ roomId, currentUserId, otherUserId);
        socket.emit('join', { user_id: currentUserId, other_user_id: otherUserId, room: roomId});
        console.log("JOIN CHAT:3"+ roomId, currentUserId, otherUserId);
        // socket.on('receive_message', (data) => {
        //     if (data.room === roomId) {
        //         setConversation(prevConversation => [
        //             ...prevConversation,
        //             data
        //         ]);
        //     }
        // console.log("JOIN CHAT:4"+ roomId, currentUserId, otherUserId);
        // });
    }

    const handleUserClick = (otherUserId) => {
        const currentUserId = store?.user.id; // Asumiendo que el ID del usuario actual se almacena aquí
        const roomId = `chat_${Math.min(currentUserId, otherUserId)}_${Math.max(currentUserId, otherUserId)}`;
        setOtherUserId(otherUserId); // Establecer el otherUserId en el estado

        setRoomId(roomId); // Establecer el roomId en el estado
        console.log("Joining room 1. :", roomId, currentUserId, otherUserId);
        // Unir a la room
        joinChat(otherUserId, roomId, currentUserId);
        // socket.emit('join', { user_id: currentUserId, other_user_id: otherUserId });
    };

    
    function submitMessageRoom(e) {
        console.log("JOIN ROOM 5");
        if (e.key === "Enter" && message.trim()) {
            console.log("DENTRO DEL IF");
            const newMessage = {
                message: message,
                sender_id: store?.user.id,
                timestamp: new Date(),
                room: roomId
            };
            console.log(newMessage);
            socket.emit('send_message', { ...newMessage });
            setConversation(prevConversation => {
                const updatedConversation = [...prevConversation, newMessage];
                console.log(updatedConversation);
                return updatedConversation;
            });
    
            setMessage("");
            // setConversation(prevConversation => [
            //     ...prevConversation,
            //     newMessage
            // ]);
            // setMessage("")
            console.log(conversation);
            console.log("JOIN ROOM 6 hemos pasado el send message");
            // socket.on('receive_message', { ...conversation });
            // socket.on('receive_message', (data) => {
            //     if (data.room === roomId) {
            //         setConversation(prevConversation => [
            //             ...prevConversation,
            //             data
            //         ]);
            //     }
            // });
        }}
        //     sendMessage(newMessage.message, roomId);
        //     // Añadir el mensaje al estado para actualizar la UI inmediatamente.
        //     setConversation(prevConversation => [
        //         ...prevConversation,
        //         newMessage
        //     ]);
        //     setMessage("")
        // }
    


    // ************************************ROOMS// ************************************
  

    // function sendMessage(message, roomId) {
    //     if (roomId && currentUserId && message.trim()) {
    //         const newMessage = {
    //             message,
    //             sender_id: currentUserId,
    //             timestamp: new Date().toISOString()
    //         };
    //         socket.emit('send_message', { ...newMessage, room: roomId });
    //         socket.on('receive_message', (data) => {
    //             if (data.room === roomId) {
    //                 setConversation(prevConversation => [
    //                     ...prevConversation,
    //                     data
    //                 ]);
    //             }
    //         });
    //     }
    // }
    

    // function sendMessage(message, roomId) {
    //     socket.emit('send_message', { message, sender_id: currentUserId, room: roomId });
    //     socket.on('receive_message', (data) => {
    //         if (data.room === roomId) {
    //             setConversation(prevConversation => [
    //                 ...prevConversation,
    //                 data
    //             ]);
    //         }
    //     });
    // }

    const handleMessageReceived = (data) => {
        if (data.room === roomId) {
            setConversation(prevConversation => [
                ...prevConversation,
                data
            ]);
        }
    };

    // function sendMessage(message, roomId) {
    //     socket.emit('send_message', { message, sender_id: currentUserId, room: roomId });
    // }

    

    function leaveChat(roomId) {
        socket.emit('leave', { room: roomId });
    }

    useEffect(() => {





    }, [socket]);
 
    useEffect(() => {
        actions.getAllUsers();
        if (!socket) return;

        const handleId = (data) => {
                setCurrentUserId(data.id);
            };

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
            console.log(conversation);
        };

        socket.connect();

        socket.on('receive_message', handleMessageReceived);
        socket.on('your_id', handleId);
        socket.on('data', handleMessage);
        socket.on('send_message_chat', handleMessage);

        
                            // socket.on('join', (data) => {
                            //     console.log(`Joined room ${data.room}`);
                            // });

                            // socket.on('receive_message', (data) => {
                            //     console.log("Received message in receive_message:", data.message);
                            //     // Añadir el mensaje recibido al estado que maneja la conversación
                            // });

        return () => {
            
            socket.off('receive_message', handleMessageReceived);
            socket.off('your_id');
            socket.off('data', handleMessage);
            
        };
    }, [socket, roomId]);
    // ************************************// ************************************




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
                    {/* {groupedMessages.map(group => ( */}
                        <div className="date">
                            {/* <small>{group.day}</small> */}
                            <ul>
                                {conversation.map((item, index) => (
                                    <li key={index} className={item.id === currentUserId ? "my-message" : "other-message"}
                                        dangerouslySetInnerHTML={{ __html: `${item.id}: ${item.message}` }}>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    {/* ))} */}
                    <input type="text" placeholder="Message..." className="form-control my-input mt-3"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={submitMessageRoom} />
                </div>
            )}
        </>
    );
}

export default ChatForm;


