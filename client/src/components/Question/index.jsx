import React from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom"
import socketIOClient from "socket.io-client";
import messages from "../../../../constants/messages.json";

const host = "http://localhost:3000"

export default function Question() {
    const socketRef = React.useRef();
    const [id, setId] = React.useState('');
    const [waiting, setWaiting] = React.useState(true);
    const [question, setQuestion] = React.useState('');
    const [answer1, setAnswer1] = React.useState('');
    const [answer2, setAnswer2] = React.useState('');
    const [answer3, setAnswer3] = React.useState('');
    const [answer4, setAnswer4] = React.useState('');
    const [correctAnswer, setCorrectAnswer] = React.useState(-1);
    const [answered, setAnswered] = React.useState(false);
    const [correct, setCorrect] = React.useState(true);
    const [chosen, setChosen] = React.useState(-1);
    const [turnEnded, setTurnEnded] = React.useState(false);
    const [showStat, setShowStat] = React.useState(false);
    const [numAnswer1, setNumAnswer1] = React.useState(0);
    const [numAnswer2, setNumAnswer2] = React.useState(0);
    const [numAnswer3, setNumAnswer3] = React.useState(0);
    const [numAnswer4, setNumAnswer4] = React.useState(0);

    const pinNumber = sessionStorage.getItem('pinNumber');
    const name = sessionStorage.getItem('name');

    const navigate = useNavigate();

    React.useEffect(() => {
        socketRef.current = socketIOClient.connect(host)

        socketRef.current.on(messages.SERVER_SEND_ID, data => {
            setId(data)
        })

        socketRef.current.emit(messages.CLIENT_PLAYER_JOIN, {
            pinNumber: pinNumber,
            name: name
        })

        socketRef.current.on(messages.SERVER_QUESTION_START, data => {
            setTurnEnded(false)
            setShowStat(false)
            setAnswered(false)
            setCorrect(true)
            setWaiting(false)
            setQuestion(data.question.question)
            setAnswer1(data.question.answer1)
            setAnswer2(data.question.answer2)
            setAnswer3(data.question.answer3)
            setAnswer4(data.question.answer4)
            setCorrectAnswer(data.question.correctAnswer)
        })

        socketRef.current.on(messages.SERVER_QUESTION_END, data => {
            setWaiting(true)
            setTurnEnded(true)
        })

        socketRef.current.on(messages.SERVER_SHOW_STAT, data => {
            setTurnEnded(true)
            setShowStat(true)
            setNumAnswer1(data.numAnswer1)
            setNumAnswer2(data.numAnswer2)
            setNumAnswer3(data.numAnswer3)
            setNumAnswer4(data.numAnswer4)
        })

        socketRef.current.on(messages.SERVER_GAME_END, data => {
            sessionStorage.removeItem('pinNumber')
            sessionStorage.removeItem('username')
            navigate('/')
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    function playerChooseAnswer(answer) {
        if (!answered) {
            setAnswered(true)
            setChosen(answer)
            setCorrect(answer == correctAnswer)
            socketRef.current.emit(messages.CLIENT_PLAYER_ANSWER, {
                pinNumber: pinNumber,
                answer: answer,
                name: name
            })
        }
    }

    return (
        <>
            {turnEnded && showStat ? <div>
                <div>Num of people choose answer 1: {numAnswer1}</div>
                <div>Num of people choose answer 2: {numAnswer2}</div>
                <div>Num of people choose answer 3: {numAnswer3}</div>
                <div>Num of people choose answer 4: {numAnswer4}</div>
                <div>Correct Answer: {correctAnswer + 1}</div>
            </div> : waiting ? <h1>Waiting for question...</h1> :
                <div>
                    <div className="question-container">
                        <div className="question-box">
                            {question}
                        </div>
                    </div>
                    <div className="answer-container">
                        <div>
                            <div className={!answered || chosen != 0 ? "answer-box" : correct ? "correct-box" : "wrong-box"}
                                onClick={() => { playerChooseAnswer(0) }}>
                                {answer1}
                            </div>
                            <div className={!answered || chosen != 1 ? "answer-box" : correct ? "correct-box" : "wrong-box"}
                                onClick={() => { playerChooseAnswer(1) }}>
                                {answer2}
                            </div>
                            <div className={!answered || chosen != 2 ? "answer-box" : correct ? "correct-box" : "wrong-box"}
                                onClick={() => { playerChooseAnswer(2) }}>
                                {answer3}
                            </div>
                            <div className={!answered || chosen != 3 ? "answer-box" : correct ? "correct-box" : "wrong-box"}
                                onClick={() => { playerChooseAnswer(3) }}>
                                {answer4}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}