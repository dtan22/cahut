const express = require('express');

const router = new express.Router();

const questionSetController = require('../controllers/questionSet.controller');

router.post('/questionset/create', questionSetController.createQuestionSet);
router.post('/questionset/update', questionSetController.updateQuestionSet);

router.post('/questionset/all', questionSetController.getQuestionSets);
router.post('/questionset', questionSetController.getQuestionSet);



module.exports = router;