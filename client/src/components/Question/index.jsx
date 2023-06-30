import React from 'react';
import './styles.css';

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import socketIOClient from "socket.io-client";
import messages from "../../../../constants/messages.json";

const host = "http://localhost:3000"

export default function Question() {
    const pinNumber = useSelector(state => state.session.pinNumber)
    const socketRef = React.useRef();
    const [waiting, setWaiting] = React.useState(true);
    const [question, setQuestion] = React.useState('');
    const [answer1, setAnswer1] = React.useState('');
    const [answer2, setAnswer2] = React.useState('');
    const [answer3, setAnswer3] = React.useState('');
    const [answer4, setAnswer4] = React.useState('');
    const [answered, setAnswered] = React.useState(false);
    const [correct, setCorrect] = React.useState(true);

    React.useEffect(() => {
        socketRef.current = socketIOClient.connect(host)

        socketRef.current.on(messages.SERVER_SEND_QUESTION, data => {
            setQuestion(data.question)
            setAnswer1(data.answer1)
            setAnswer2(data.answer2)
            setAnswer3(data.answer3)
            setAnswer4(data.answer4)
            setWaiting(false)
        })

        socketRef.current.on(messages.SERVER_PLAYER_ANSWER_RESPONSE, data => {
            setCorrect(data.correct)
        })

        socketRef.current.on(messages.SERVER_QUESTION_END, data => {
            setWaiting(true)
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    function playerChooseAnswer(answer) {
        if (!answered) {
            setAnswered(true)
            socketRef.current.emit(messages.CLIENT_PLAYER_ANSWER, {
                pinNumber: pinNumber,
                answer: answer
            })
        }
    }

    return (
        <>
            {waiting ? <h1>Waiting for question...</h1> :
                <div>
                    <div className="question-container">
                        <div className="question-box">
                            {question}
                        </div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-box" onClick={() => { playerChooseAnswer(0) }}>
                            {answer1}
                        </div>
                        <div className="answer-box" onClick={() => { playerChooseAnswer(1) }}>
                            {answer2}
                        </div>
                        <div className="answer-box" onClick={() => { playerChooseAnswer(2) }}>
                            {answer3}
                        </div>
                        <div className="answer-box" onClick={() => { playerChooseAnswer(3) }}>
                            {answer4}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}