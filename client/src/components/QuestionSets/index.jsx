import React from 'react';
import "./styles.css"
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPinNumber } from '../../utils/slices/sessionSlice';

export default function QuestionSets({
    questionSets,
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const username = auth.username;

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
                pinNumber = data.pinNumber;
                break;
            }
            number++;
        }
        navigate('/questionset/create/' + pinNumber);
    }

    async function startGame(questionSet) {
        const body = {
            username: username,
            pinNumber: questionSet.pinNumber,
            state: 'open',
        }
        await postData('questionset/state', body);
        dispatch(setPinNumber(questionSet.pinNumber));
        setTimeout(() => { navigate('/hosting') }, 1000);
    }

    return (
        <div>
            <h1>Question Sets</h1>
            <button onClick={createQuestionSet}>
                Create Question Set
            </button>
            <div>
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