import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/chat.css";
import { socket } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as emoji from "emoji-api";


function ChatForm({ userName, setShowChatModal }) {
    const { store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [emojis, setEmojis] = useState([]);

    function submitMessageRoom(e) {
        if (e.key === "Enter" && message.trim()) {
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
            socket.emit('data', { newMessage, room: store.room })
            setMessage("");
        }
    }

    const handleMessage = (data) => {
        const messageText = data.data.newMessage.message;
        const enhancedMessage = linkify(messageText);
        const timestamp = new Date(data.data.newMessage.timestamp);
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
        setCurrentUserId(data.data.newMessage.sender_name)
        setConversation(prevConversation => [...prevConversation, userMessage]);
    };

    useEffect(() => {
        actions.getAllUsers();
        if (!socket) return;

        const handleId = (data) => {
            setCurrentUserId(data.sender_id);
        };

        socket.connect();
        socket.on('your_id', handleId);
        socket.on('data', handleMessage);
    }, [socket]);

    function groupMessagesByDay(conversation) {
        const groupedByDay = conversation.reduce((acc, message) => {
            const dateObj = new Date(message.timestamp);
            if (isNaN(dateObj)) {
                console.error("Invalid date from timestamp", message.timestamp);
                return acc;
            }
            const day = new Intl.DateTimeFormat('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);

            if (!acc[day]) {
                acc[day] = [];
            }
            const messageWithSenderName = { ...message };
            acc[day].push(messageWithSenderName);
            return acc;
        }, {});
        return Object.keys(groupedByDay).map(day => ({
            day,
            messages: groupedByDay[day]
        }));
    }

    function linkify(inputText) {
        if (typeof inputText !== 'string') {
            console.error('linkify function expected a string but received:', inputText);
            return inputText;
        }
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return inputText.replace(urlRegex, function (url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });
    }

    const handleCloseChatModal = () => {
        socket.emit('leave_room', { user_id: store.user.name, room: roomId });
        socket.off('data', handleMessage);
        setShowChatModal(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };

    const addEmojiToMessage = (emoji) => {
        setMessage(message + emoji);
    };

    const sendMessage = () => {
        console.log("Mensaje enviado:", message);
        const newMessage = {
            message: message,
            sender_id: store?.user.id,
            sender_name: store?.user.name,
            timestamp: new Date(),
            room: store.room,
            isSender: true,
            recipient_id: userName,
        };

        socket.emit('data', { newMessage, room: store.room });

        setMessage("");
    };



    const groupedMessages = groupMessagesByDay(conversation);

    useEffect(() => {
        const fetchEmojis = async () => {
            try {
                const response = emoji.all();
                const filteredEmojis = response.filter(e => {
                    const formattedName = e.formattedName ? e.formattedName.toLowerCase() : '';
                    const group = e.group ? e.group.toLowerCase() : '';
                    const subGroup = e.subGroup ? e.subGroup.toLowerCase() : '';
                    return (
                        formattedName.includes("face") &&
                        !group.includes("animals") &&
                        !subGroup.includes("person") &&
                        !formattedName.includes("man") &&
                        !formattedName.includes("woman") &&
                        !formattedName.includes("wind") &&
                        !formattedName.includes("moon") &&
                        !formattedName.includes("person") &&
                        !formattedName.includes("clouds") &&
                        !formattedName.includes("with") &&
                        !formattedName.includes("smiling face") &&
                        !formattedName.includes("frowning face") &&
                        !formattedName.includes("disguised face") &&
                        !formattedName.includes("sun")
                    );
                });
                const uniqueEmojis = Array.from(new Set(filteredEmojis.map(e => e.emoji))).map(emoji => filteredEmojis.find(e => e.emoji === emoji));
                setEmojis(uniqueEmojis);
            } catch (error) {
                console.error("Error al obtener los emojis:", error);
            }
        };

        fetchEmojis();
    }, []);


    return (
        <>
            <div>
                <p className='button-close-chat' onClick={handleCloseChatModal}>
                    <text>cerrar chat </text>
                    <i className="fa-regular fa-rectangle-xmark"></i>
                </p>
                <h4 className='orange-box'>Hablando con {userName} </h4>
                <div className="chat-container">
                    {groupedMessages.map(group => (
                        <div key={group.day} className="date">
                            <small>{group.day}</small>
                            <ul>
                                {group.messages.map((item, index) => (
                                    <li key={index} className={item.sender_name === userName ? "other-message" : "my-message"}>
                                        <div className="message-wrapper">
                                            <span className="sender-name">{item.sender_name} : </span>
                                            <span className={`message-text ${item.sender_name === userName ? "my-message-text" : "other-message-text"}`} dangerouslySetInnerHTML={{ __html: `${item.message}` }}></span>
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    ))}
                </div>
                <div className="message-input-container">
                    <div className="input-container">
                        <label htmlFor="messageInput" className={`message-label ${message ? 'active' : ''}`}>Message...</label>
                        <input
                            id="messageInput"
                            type="text"
                            placeholder=""
                            className="form-control my-input mt-3"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={submitMessageRoom}
                        />
                    </div>
                    <button className="emoji-button" onClick={toggleEmojiPicker}>
                        <i className="fa-regular fa-face-smile"></i>
                    </button>
                    <button className="send-button" onClick={sendMessage}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            {showEmojis && (
                <div className="emoji-picker">
                    {emojis.map((emoji, index) => (
                        <span key={index} role="img" aria-label={emoji.formattedName} onClick={() => addEmojiToMessage(emoji.emoji)}>
                            {emoji.emoji}
                        </span>
                    ))}
                </div>
            )}
        </>
    );

}

export default ChatForm;
