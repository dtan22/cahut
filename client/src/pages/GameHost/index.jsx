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
    const [turnEnded, setTurnEnded] = useState(false);
    const [showStat, setShowStat] = useState(false);
    const username = sessionStorage.getItem("username");
    const pinNumber = sessionStorage.getItem("pinNumber");

    const [numAnswer1, setNumAnswer1] = useState(0);
    const [numAnswer2, setNumAnswer2] = useState(0);
    const [numAnswer3, setNumAnswer3] = useState(0);
    const [numAnswer4, setNumAnswer4] = useState(0);

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
            setPlayers(players => [...players, data])
        })

        socketRef.current.on(messages.SERVER_PLAYER_ANSWER, data => {
            if (data.answer == 0) setNumAnswer1(numAnswer1 => numAnswer1 + 1)
            if (data.answer == 1) setNumAnswer2(numAnswer2 => numAnswer2 + 1)
            if (data.answer == 2) setNumAnswer3(numAnswer3 => numAnswer3 + 1)
            if (data.answer == 3) setNumAnswer4(numAnswer4 => numAnswer4 + 1)
        })

        socketRef.current.on(messages.SERVER_QUESTION_END, data => {
            setTurnEnded(true)
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
            setTurnEnded(false);
            setShowStat(false);

            setQuestion(data.data.question);
            setAnswer1(data.data.answer1);
            setAnswer2(data.data.answer2);
            setAnswer3(data.data.answer3);
            setAnswer4(data.data.answer4);
            setCorrectAnswer(data.data.correctAnswer);
            setNumAnswer1(0);
            setNumAnswer2(0);
            setNumAnswer3(0);
            setNumAnswer4(0);

            socketRef.current.emit(messages.CLIENT_HOST_NEXT_QUESTION, body);

            setQuestionNumber(data.data.questionNumber);
        } else {
            setGameEnded(true);
        }
    }

    async function showStatistic() {
        const body = {
            pinNumber: pinNumber,
            numAnswer1: numAnswer1,
            numAnswer2: numAnswer2,
            numAnswer3: numAnswer3,
            numAnswer4: numAnswer4,
        }

        socketRef.current.emit(messages.CLIENT_HOST_SHOW_STAT, body);
    }

    return (
        <div className="gamehost-container">
            <button onClick={() => {
                socketRef.current.emit(messages.CLIENT_HOST_END, { pinNumber: pinNumber });
                navigate("/dashboard")
                sessionStorage.removeItem("pinNumber");
            }}>End Game</button>
            <div>
                <div className="questionset-info-box">
                    <h2>Question Set: {questionSetName}</h2>
                    <h2>Pin Number: {pinNumber}</h2>
                </div>
                {gameEnded ? <div style={{
                    width: "100%",
                    height: "100%",
                    color: "black",
                    textAlign: "center",
                }}><h2>No question left...</h2></div> :
                    waiting ?
                        <div className="waiting-box">
                            <h2>Waiting for players to join...</h2>
                            <button onClick={nextQuestion}>Start</button>
                            <div className="player-name-container">
                                {players.map((player, index) => {
                                    return <div key={index} className="player-name-box">{player.name}</div>
                                })}
                            </div>
                        </div>
                        :
                        <div className="question-info-box">
                            <h2>Question Number: {questionNumber + 1}</h2>
                            <h2>Question: {question}</h2>
                            <div>Answer 1: {answer1}</div>
                            <div>Answer 2: {answer2}</div>
                            <div>Answer 3: {answer3}</div>
                            <div>Answer 4: {answer4}</div>
                            <h2>Correct Answer: {correctAnswer + 1}</h2>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }}>
                                {turnEnded && <button onClick={nextQuestion}>Next Question</button>}
                                {turnEnded && <button onClick={showStatistic}>Show Statistic</button>}
                            </div>
                        </div>
                }
            </div>
            <Chat />
        </div>
    )
}