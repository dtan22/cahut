import React from 'react';
import "./styles.css"
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { setPinNumber } from '../../utils/slices/sessionSlice';

export default function QuestionSets({
    questionSets,
}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    React.useEffect(() => {
        if (!username) {
            navigate('/auth');
        }
    }, []);

    async function createQuestionSet() {
        let number = 1;
        let pinNumber = null;
        while (true) {
            const body = {
                username: username,
                questionSetName: 'untitled-' + number,
            }
            const data = await postData('questionset/create', body);
            if (data.success) {
                pinNumber = data.data.pinNumber;
                console.log(data.data.pinNumber)
                const res = await postData('question/create', {
                    pinNumber: data.data.pinNumber,
                    questionNumber: 0,
                    question: 'What is the first letter of the alphabet?',
                    answer1: 'A',
                    answer2: 'B',
                    answer3: 'C',
                    answer4: 'D',
                    correctAnswer: 0,
                })
                console.log(res)
                break;
            }
            number++;
        }
        window.location.reload(false);
    }

    async function startGame(questionSet) {
        const body = {
            username: username,
            pinNumber: questionSet.pinNumber,
            state: 'open',
        }
        await postData('questionset/state', body);
        sessionStorage.setItem('pinNumber', questionSet.pinNumber);
        sessionStorage.setItem('name', "HOST");
        setTimeout(() => { navigate('/hosting') }, 1000);
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
                borderRadius: '10px',
                backgroundColor: 'white',
                color: 'black',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            }}>
                <h1>Question Sets</h1>
                <button style={{
                    width: '20vw',
                    height: '10vh',
                }} onClick={createQuestionSet}>
                    Add new question set
                </button>
            </div>
            <div className='question-sets-container'>
                {questionSets.map((value, index) => {
                    return (
                        <div key={index}>
                            <h2>{value.questionSetName}-({value.pinNumber})</h2>
                            <button onClick={() => navigate('/questionset/create/' + value.pinNumber)}>
                                Edit
                            </button>
                            <button onClick={() => startGame(value)}>
                                Start
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}