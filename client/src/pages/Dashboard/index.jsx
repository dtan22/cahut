import React from 'react';
import './styles.css';
import { getData, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import QuestionSets from '../../components/QuestionSets';

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const username = auth.username;

    const [questionSets, setQuestionSets] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);

    React.useEffect(() => {
        if (!username) {
            navigate('/auth');
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
        </div>
    )
}