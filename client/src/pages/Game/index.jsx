import React from "react";
import Chat from "../../components/Chat"
import Question from "../../components/Question"
import "./styles.css"

export default function Game() {
    return (
        <div className="game-container">
            <Question />
            <Chat />
        </div>
    )
}