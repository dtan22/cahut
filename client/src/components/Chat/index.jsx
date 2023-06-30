import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import socketIOClient from "socket.io-client";

import './styles.css'

import messages from "../../../../constants/messages.json";

const host = "http://localhost:3000"

export default function Chat() {
    const [mess, setMess] = useState([]);
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');

    const auth = useSelector(state => state.auth)
    const username = auth.username
    const socketRef = useRef();
    const messagesEnd = useRef();

    const pinNumber = useSelector(state => state.session.pinNumber)

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)

        socketRef.current.emit(messages.CLIENT_PLAYER_JOIN, { pinNumber: pinNumber })

        socketRef.current.on(messages.SERVER_SEND_ID, data => {
            setId(data)
        })

        socketRef.current.on(messages.SERVER_SEND_CHAT_MESSAGE, data => {
            setMess(oldMsgs => [...oldMsgs, data])
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message !== null && message.trim() !== '') {
            const msg = {
                message: message,
                id: id,
                pinNumber: pinNumber
            }
            socketRef.current.emit(messages.CLIENT_SEND_CHAT_MESSAGE, msg)
            setMessage('')
        }
    }

    const scrollToBottom = () => {
        messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }

    const renderMess = mess.map((m, index) =>
        <div key={index} className={`${m.id === id ? 'your-message' : 'other-people'} chat-item`}>
            {m.message}
        </div>
    )

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            sendMessage()
        }
    }

    return (
        <div className="chat-container">
            <div className="box-chat">
                <div className="box-chat_message">
                    {renderMess}
                    <div style={{ float: "left", clear: "both" }}
                        ref={messagesEnd}>
                    </div>
                </div>

                <div className="send-box">
                    <textarea
                        value={message}
                        onKeyDown={onEnterPress}
                        onChange={handleChange}
                        placeholder="Enter message..."
                    />
                    <button onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}