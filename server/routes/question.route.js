const express = require('express');

const router = new express.Router();

const questionController = require('../controllers/question.controller');

router.post('/question', questionController.getQuestion)
router.post('/question/create', questionController.createQuestion);

router.post('/question/all', questionController.getQuestions);

module.exports = router;