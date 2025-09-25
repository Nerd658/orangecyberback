
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');
const quizController = require('../controllers/quizController');

// User routes
router.post('/check-username', userController.checkUsername);
router.get('/user-rank', userController.getUserRank);

// Question routes
router.get('/questions', questionController.getQuestions);

// Quiz routes
router.post('/submit-attempt', quizController.submitAttempt);
router.post('/submit-final', quizController.submitFinal);
router.get('/leaderboard', quizController.getLeaderboard);

module.exports = router;
