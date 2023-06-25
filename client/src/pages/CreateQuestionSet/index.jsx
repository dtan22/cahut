import React from 'react';
import './styles.css';
import { getData, postData } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function CreateQuestionSet() {
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const username = auth.username;
    const { questionSetId } = useParams();

    const [questionSetName, setQuestionSetName] = React.useState('untitled');
    const [currentQuestion, setCurrentQuestion] = React.useState(0);

    const defaultQuestionSet = [{
        question: 'What is the first letter of the alphabet?',
        answer1: 'A',
        answer2: 'B',
        answer3: 'C',
        answer4: 'D',
        correctAnswer: 0,
    }]

    const [question, setQuestion] = React.useState(defaultQuestionSet[0].question);
    const [answer1, setAnswer1] = React.useState(defaultQuestionSet[0].answer1);
    const [answer2, setAnswer2] = React.useState(defaultQuestionSet[0].answer2);
    const [answer3, setAnswer3] = React.useState(defaultQuestionSet[0].answer3);
    const [answer4, setAnswer4] = React.useState(defaultQuestionSet[0].answer4);
    const [correctAnswer, setCorrectAnswer] = React.useState(defaultQuestionSet[0].correctAnswer);
    const [questionSet, setQuestionSet] = React.useState(defaultQuestionSet);

    React.useEffect(() => {
        if (!username) {
            navigate('/auth');
        }
        async function getQuestionSet() {
            const qsetBody = {
                questionSetId: questionSetId,
                username: username,
            }
            const qset = await postData('questionset', qsetBody);
            if (qset.success) {
                setQuestionSetName(qset.data.questionSetName);
            } else {
                navigate('/dashboard');
            }
            const body = {
                questionSetId: questionSetId,
                username: username,
            }
            const data = await postData('question/all', body);
            if (data.success) {
                const qs = data.data;
                if (qs.length > 0) {
                    setQuestionSet(qs);
                    setQuestion(qs[0].question);
                    setAnswer1(qs[0].answer1);
                    setAnswer2(qs[0].answer2);
                    setAnswer3(qs[0].answer3);
                    setAnswer4(qs[0].answer4);
                    setCorrectAnswer(qs[0].correctAnswer);
                }
            }
        }
        getQuestionSet();
    }, []);

    function saveCurQuestion() {
        setQuestionSet(questionSet.map((value, index) => {
            if (index === currentQuestion) {
                return {
                    question: question,
                    answer1: answer1,
                    answer2: answer2,
                    answer3: answer3,
                    answer4: answer4,
                    correctAnswer: correctAnswer,
                }
            }
            return value;
        }));
    }

    function changeQuestion(index) {
        setCurrentQuestion(index);
        setQuestion(questionSet[index].question);
        setAnswer1(questionSet[index].answer1);
        setAnswer2(questionSet[index].answer2);
        setAnswer3(questionSet[index].answer3);
        setAnswer4(questionSet[index].answer4);
        setCorrectAnswer(questionSet[index].correctAnswer);
    }

    function addNewQuestion() {
        const index = questionSet.length
        setQuestionSet([...questionSet, ...defaultQuestionSet]);
        setCurrentQuestion(index);
        setQuestion(defaultQuestionSet[0].question);
        setAnswer1(defaultQuestionSet[0].answer1);
        setAnswer2(defaultQuestionSet[0].answer2);
        setAnswer3(defaultQuestionSet[0].answer3);
        setAnswer4(defaultQuestionSet[0].answer4);
        setCorrectAnswer(defaultQuestionSet[0].correctAnswer);
    }

    function finish() {
        questionSet.forEach((value, index) => {
            const body = {
                questionSetId: questionSetId,
                questionNumber: index,
                question: value.question,
                answer1: value.answer1,
                answer2: value.answer2,
                answer3: value.answer3,
                answer4: value.answer4,
                correctAnswer: value.correctAnswer,
            }
            postData('question/create', body)

        });
        const body = {
            username: username,
            questionSetId: questionSetId,
            questionSetName: questionSetName,
        }
        postData('questionset/update', body)
        setTimeout(() => navigate('/dashboard'), 1000);
    }

    function incrementAnswer() {
        setCorrectAnswer((correctAnswer + 1) % 4);
    }

    function decrementAnswer() {
        setCorrectAnswer((correctAnswer + 3) % 4);
    }

    return (
        <div>
            <textarea
                value={questionSetName}
                onChange={e => setQuestionSetName(e.target.value)}
            />
            <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
            />
            <textarea
                value={answer1}
                onChange={e => setAnswer1(e.target.value)}
            />
            <textarea
                value={answer2}
                onChange={e => setAnswer2(e.target.value)}
            />
            <textarea
                value={answer3}
                onChange={e => setAnswer3(e.target.value)}
            />
            <textarea
                value={answer4}
                onChange={e => setAnswer4(e.target.value)}
            />
            <div>
                Correct answer: {correctAnswer == 0 ? answer1 : correctAnswer == 1 ? answer2 : correctAnswer == 2 ? answer3 : answer4}
            </div>
            <button onClick={incrementAnswer}>next Answer</button>
            <button onClick={decrementAnswer}>previous Answer</button>
            <button onClick={saveCurQuestion}>Save</button>
            {questionSet.map((question, index) =>
                <button key={index} onClick={() => changeQuestion(index)}>
                    {index + 1}
                </button>
            )}
            <button onClick={addNewQuestion}>+</button>
            <button onClick={finish}>Finish</button>
        </div>
    )
}