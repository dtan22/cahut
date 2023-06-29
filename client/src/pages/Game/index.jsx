import React from "react";
import Chat from "../../components/Chat"
import Question from "../../components/Question"
import "./styles.css"
import { useNavigate } from "react-router-dom";

export default function Game() {
    const navigate = useNavigate();
    const pinNumber = sessionStorage.getItem('pinNumber');

    React.useEffect(() => {
        if (!pinNumber) {
            navigate('/');
        }
    }, []);


    return (
        <div className="game-container">
            <Question />
            <Chat />
        </div>
    )
}