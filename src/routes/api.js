
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');
const quizController = require('../controllers/quizController');
const cuidController = require('../controllers/cuidController');

// User routes
router.post('/check-username', userController.checkUsername);
router.get('/user-rank', userController.getUserRank);

// Cuid routes
router.post('/cuid', cuidController.saveCuid);
router.get('/cuids', cuidController.getCuids);

// Question routes
router.get('/questions', questionController.getQuestions);

// Quiz routes
router.post('/submit-attempt', quizController.submitAttempt);
router.post('/submit-final', quizController.submitFinal);
router.get('/leaderboard', quizController.getLeaderboard);

module.exports = router;
