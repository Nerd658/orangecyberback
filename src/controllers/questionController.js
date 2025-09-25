
const questionService = require('../services/questionService');

const getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getQuestions,
};
