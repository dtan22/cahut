import React from 'react';
import './styles.css';
import { postData } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateQuestionSet() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');
    const { pinNumber } = useParams();

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
                pinNumber: pinNumber,
                username: username,
            }
            const qset = await postData('questionset', qsetBody);
            if (qset.success) {
                setQuestionSetName(qset.data.questionSetName);
            } else {
                navigate('/dashboard');
            }
            const body = {
                pinNumber: pinNumber,
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

    function changeQuestion(index) {
        setQuestionSet(questionSet => questionSet.map((value, index) => {
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
        setQuestionSet(questionSet => questionSet.map((value, index) => {
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
        }).map((value, index) => {
            const body = {
                pinNumber: pinNumber,
                questionNumber: index,
                question: value.question,
                answer1: value.answer1,
                answer2: value.answer2,
                answer3: value.answer3,
                answer4: value.answer4,
                correctAnswer: value.correctAnswer,
            }
            postData('question/create', body)
            return value
        }));
        const body = {
            username: username,
            pinNumber: pinNumber,
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
        <div className='cqs'>
            <h1>
                Create Question Set
            </h1>
            <div className='qs-attribute'>
                Question Set Name:
                <textarea
                    value={questionSetName}
                    onChange={e => setQuestionSetName(e.target.value)}
                />
            </div>
            <div className='qs-attribute'>
                Question:
                <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                />
            </div>
            <div className='qs-attribute'>
                Answer 1:
                <textarea
                    value={answer1}
                    onChange={e => setAnswer1(e.target.value)}
                />
            </div>
            <div className='qs-attribute'>
                Answer 2:
                <textarea
                    value={answer2}
                    onChange={e => setAnswer2(e.target.value)}
                />
            </div>
            <div className='qs-attribute'>
                Answer 3:
                <textarea
                    value={answer3}
                    onChange={e => setAnswer3(e.target.value)}
                />
            </div>

            <div className='qs-attribute'>
                Answer 4:
                <textarea
                    value={answer4}
                    onChange={e => setAnswer4(e.target.value)}
                />
            </div>

            <div className='qs-attribute'>
                <div className='correct-answer'>
                    Correct answer:
                    <button className='answer-button' onClick={decrementAnswer}>previous Answer</button>
                    <button className='answer-button' onClick={incrementAnswer}>next Answer</button>
                    <div style={{
                        textAlign: 'center',
                        marginLeft: '2vw',
                    }}>
                        {correctAnswer == 0 ? answer1 : correctAnswer == 1 ? answer2 : correctAnswer == 2 ? answer3 : answer4}
                    </div>

                </div>
            </div>
            <div className='question-select'>
                {questionSet.map((question, index) =>
                    <button key={index} onClick={() => changeQuestion(index)}>
                        {index + 1}
                    </button>
                )}
                {questionSet.length < 5 && <button onClick={addNewQuestion}>+</button>}
            </div>
            <button onClick={finish}>Save and Finish</button>
        </div>
    )
}