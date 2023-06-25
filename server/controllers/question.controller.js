const db = require('../db/index');

const Question = db.question;

const createQuestion = async (req, res) => {
    try {
        const { questionSetId, questionNumber, question, answer1, answer2, answer3, answer4, correctAnswer } = req.body;
        const existed = await Question.findOne({
            where: {
                questionSetId: questionSetId,
                questionNumber: questionNumber,
            },
        });
        if (existed) {
            Question.update({
                question: question,
                answer1: answer1,
                answer2: answer2,
                answer3: answer3,
                answer4: answer4,
                correctAnswer: correctAnswer,
            }, {
                where: {
                    questionSetId: questionSetId,
                    questionNumber: questionNumber,
                },
            });
            res.status(200).send({
                success: true,
                message: 'Question updated successfully.',
            });
            return;
        }
        const questionSet = await Question.create({
            questionSetId: questionSetId,
            questionNumber: questionNumber,
            question: question,
            answer1: answer1,
            answer2: answer2,
            answer3: answer3,
            answer4: answer4,
            correctAnswer: correctAnswer,
        });
        if (questionSet) {
            res.status(200).send({
                success: true,
                message: 'Question created successfully.',
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question creation failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while creating the question.',
        });
    }
}

const getQuestions = async (req, res) => {
    try {
        const { questionSetId } = req.body;
        const questions = await Question.findAll({
            where: {
                questionSetId: questionSetId,
            },
        });
        if (questions) {
            res.status(200).send({
                success: true,
                message: 'Questions retrieved successfully.',
                data: questions,
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Questions retrieval failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while retrieving questions.',
        });
    }
}

const getQuestion = async (req, res) => {
    try {
        const { questionSetId, questionNumber } = req.body;
        const question = await Question.findOne({
            where: {
                questionSetId: questionSetId,
                questionNumber: questionNumber,
            },
        });
        if (question) {
            res.status(200).send({
                success: true,
                message: 'Question retrieved successfully.',
                data: question,
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question retrieval failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while retrieving the question.',
        });
    }
}

module.exports = {
    createQuestion,
    getQuestions,
    getQuestion,
}