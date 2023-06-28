const db = require('../db/index');

const QuestionSet = db.questionSet;

const createQuestionSet = async (req, res) => {
    try {
        const { username, questionSetName } = req.body;
        const existed = await QuestionSet.findOne({
            where: {
                username: username,
                questionSetName: questionSetName,
            },
        });
        if (existed) {
            res.status(200).send({
                success: false,
                message: 'Question set name already exists.',
            });
            return;
        }
        const questionSet = await QuestionSet.create({
            username: username,
            questionSetName: questionSetName,
            state: "closed"
        });
        if (questionSet) {
            res.status(200).send({
                success: true,
                message: 'Question set created successfully.',
                data: questionSet,
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question set creation failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while creating the question set.',
        });
    }
}

const getQuestionSets = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            res.status(200).send({
                success: false,
                message: 'Username cannot be empty.',
            });
            return;
        }
        const questionSets = await QuestionSet.findAll({
            where: {
                username: username,
            },
        });
        if (questionSets) {
            res.status(200).send({
                success: true,
                message: 'Question sets retrieved successfully.',
                data: questionSets,
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question sets retrieval failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while retrieving question sets.',
        });
    }
}

const updateQuestionSet = async (req, res) => {
    try {
        const { username, pinNumber, questionSetName } = req.body;
        if (!username || !pinNumber || !questionSetName) {
            res.status(200).send({
                success: false,
                message: 'Username, question set id and question set name cannot be empty.',
            });
            return;
        }
        const questionSet = await QuestionSet.update({
            questionSetName: questionSetName,
        }, {
            where: {
                username: username,
                pinNumber: pinNumber,
            },
        });
        if (questionSet) {
            res.status(200).send({
                success: true,
                message: 'Question set updated successfully.',
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question set update failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while updating the question set.',
        });
    }
}

const getQuestionSet = async (req, res) => {
    try {
        const { username, pinNumber } = req.body;
        const questionSet = await QuestionSet.findOne({
            where: {
                username: username,
                pinNumber: pinNumber,
            },
        });
        if (questionSet) {
            res.status(200).send({
                success: true,
                message: 'Question set retrieved successfully.',
                data: questionSet,
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question set retrieval failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while retrieving the question set.',
        });
    }
}

const updateQuestionSetState = async (req, res) => {
    try {
        const { username, pinNumber, state } = req.body;
        const questionSet = await QuestionSet.update({
            state: state,
        }, {
            where: {
                username: username,
                pinNumber: pinNumber,
            },
        });
        if (questionSet) {
            res.status(200).send({
                success: true,
                message: 'Question set state updated successfully.',
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Question set state update failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while updating the question set state.',
        });
    }
}

module.exports = {
    createQuestionSet,
    getQuestionSets,
    getQuestionSet,
    updateQuestionSet,
    updateQuestionSetState,
}
