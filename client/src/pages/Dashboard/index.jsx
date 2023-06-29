import React from 'react';
import './styles.css';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

import QuestionSets from '../../components/QuestionSets';

export default function Dashboard() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');
    const pinNumber = sessionStorage.getItem('pinNumber');

    const [questionSets, setQuestionSets] = React.useState([]);

    React.useEffect(() => {
        if (!username) {
            navigate('/auth');
        }
        if (pinNumber) {
            navigate('/hosting');
        }

        async function getQuestionSets() {
            const data = await postData('questionset/all', {
                username: username
            });
            setQuestionSets(data.data);
        }

        getQuestionSets();
    }, []);
    return (
        <div>
            <h1>Dashboard</h1>
            <QuestionSets questionSets={questionSets} />
            <button onClick={() => {
                sessionStorage.removeItem('username');
                navigate('/auth')
            }}>Logout</button>
        </div>
    )
}