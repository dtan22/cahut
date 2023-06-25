import React from 'react';
import "./styles.css"
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
        let questionSetId = null;
        while (true) {
            const body = {
                username: username,
                questionSetName: 'untitled-' + number,
            }
            const data = await postData('questionset/create', body);
            if (data.success) {
                questionSetId = data.questionSetId;
                break;
            }
            number++;
        }
        navigate('/questionset/create/' + questionSetId);
    }

    function startGame() {
        navigate('/gamehost');
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
                            <h2>{value.questionSetName}-({value.questionSetId})</h2>
                            <button onClick={() => navigate('/questionset/create/' + value.questionSetId)}>
                                Edit
                            </button>
                            <button onClick={startGame}>
                                Start
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}