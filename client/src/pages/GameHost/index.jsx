import React from "react";
import { useState } from "react";
import { getData, postData } from "../../utils/api";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../components/Chat";

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
    const username = useSelector((state) => state.auth.username);
    const pinNumber = useSelector((state) => state.session.pinNumber);

    const navigate = useNavigate();

    React.useEffect(() => {
        async function getQuestionSet() {
            const body = {
                pinNumber: pinNumber,
                username: username,
            };
            const data = await postData("questionset", body);
            if (data.success) {
                setQuestionSetName(data.data.questionSetName);
            } else {
                navigate("/dashboard");
            }
        }
        getQuestionSet();
    }, []);

    async function nextQuestion() {
        const body = {
            pinNumber: pinNumber,
            questionNumber: questionNumber + 1,
        }

        const data = await postData('question', body)
        console.log(data)
        console.log(body)
        if (data.success) {
            if (waiting) setWaiting(false);
            setQuestionNumber(data.data.questionNumber);
            setQuestion(data.data.question);
            setAnswer1(data.data.answer1);
            setAnswer2(data.data.answer2);
            setAnswer3(data.data.answer3);
            setAnswer4(data.data.answer4);
            setCorrectAnswer(data.data.correctAnswer);
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
                <button onClick={() => navigate("/dashboard")}>End Game</button>

            </div>
            <Chat />
        </div>
    )
}