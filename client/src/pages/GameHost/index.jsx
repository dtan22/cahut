import React from "react";
import { useState, useRef } from "react";
import { getData, postData } from "../../utils/api";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import Chat from "../../components/Chat";
import messages from "../../../../constants/messages.json";
import socketIOClient from "socket.io-client";

const host = "http://localhost:3000";

export default function GameHost() {
    const [waiting, setWaiting] = useState(true);
    const [questionNumber, setQuestionNumber] = useState(-1);
    const [question, setQuestion] = useState("");
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
    const [answer3, setAnswer3] = useState("");
    const [answer4, setAnswer4] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState(-1);
    const [questionSetName, setQuestionSetName] = useState("");
    const [gameEnded, setGameEnded] = useState(false);
    const [players, setPlayers] = useState([]);
    const [id, setId] = useState("");
    const name = sessionStorage.getItem("name");
    const username = sessionStorage.getItem("username");
    const pinNumber = sessionStorage.getItem("pinNumber");

    const socketRef = useRef();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!pinNumber || !username) {
            navigate("/dashboard");
        }
        async function getQuestionSet() {
            const body = {
                pinNumber: pinNumber,
                username: username,
            };
            const data = await postData("questionset", body);
            if (data.success) {
                setQuestionSetName(data.data.questionSetName);
            } else {
                sessionStorage.removeItem("pinNumber");
                navigate("/dashboard");
            }
        }
        getQuestionSet();

        socketRef.current = socketIOClient.connect(host)

        socketRef.current.emit(messages.CLIENT_HOST_WAIT, { pinNumber: pinNumber })

        socketRef.current.on(messages.SERVER_SEND_ID, data => {
            setId(data)
        })

        socketRef.current.on(messages.SERVER_PLAYER_JOIN, data => {
            console.log(data)
            setPlayers(players => [...players, data])
        })
    }, []);

    console.log(players)

    async function nextQuestion() {
        const body = {
            pinNumber: pinNumber,
            questionNumber: questionNumber + 1,
        }

        const data = await postData('question', body)

        if (data.success) {
            if (waiting) setWaiting(false);

            setQuestion(data.data.question);
            setAnswer1(data.data.answer1);
            setAnswer2(data.data.answer2);
            setAnswer3(data.data.answer3);
            setAnswer4(data.data.answer4);
            setCorrectAnswer(data.data.correctAnswer);

            socketRef.current.emit(messages.CLIENT_HOST_NEXT_QUESTION, body);

            setQuestionNumber(data.data.questionNumber);
        } else {
            setGameEnded(true);
        }
    }

    return (
        <div>
            <h1>Game Host</h1>
            <div>
                <h2>Question Set: {questionSetName}</h2>
                <h2>Pin Number: {pinNumber}</h2>
                {gameEnded ? <h2>Game Ended</h2> :
                    waiting ?
                        <div>
                            <h2>Waiting for players to join...</h2>
                            {players.map((player, index) => {
                                return <div key={index}>{player.name}({player.id}) </div>
                            })}
                            <button onClick={nextQuestion}>Start</button>
                        </div>
                        :
                        <div>
                            <h2>Question Number: {questionNumber}</h2>
                            <h2>Question: {question}</h2>
                            <h2>Answer 1: {answer1}</h2>
                            <h2>Answer 2: {answer2}</h2>
                            <h2>Answer 3: {answer3}</h2>
                            <h2>Answer 4: {answer4}</h2>
                            <h2>Correct Answer: {correctAnswer + 1}</h2>
                            <button onClick={nextQuestion}>Next Question</button>
                        </div>
                }

                <button onClick={() => {
                    socketRef.current.emit(messages.CLIENT_HOST_END, { pinNumber: pinNumber });
                    navigate("/dashboard")
                    sessionStorage.removeItem("pinNumber");
                }}>End Game</button>

            </div>
            <Chat />
        </div>
    )
}