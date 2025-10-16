
const quizService = require('../services/quizService');

const submitAttempt = async (req, res) => {
  const { username, answers, time_taken } = req.body;
  const io = req.io;

  if (!username || !answers || time_taken === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, message: 'Answers must be a non-empty array' });
  }

  if (typeof time_taken !== 'number' || time_taken < 0) {
    return res.status(400).json({ success: false, message: 'Invalid time_taken' });
  }

  try {
    const result = await quizService.submitAttempt(username, answers, time_taken);
    if (result.success) {
      io.emit('attempt_submitted', { username, score: result.score });
      res.status(200).json(result);
    } else {
      res.status(403).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const submitFinal = async (req, res) => {
  const { username } = req.body;
  const io = req.io;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    const result = await quizService.submitFinal(username);
    if (result.success) {
      const leaderboard = await quizService.getLeaderboard();
      io.emit('leaderboard_updated', leaderboard);
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getLeaderboard = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

  if (req.query.limit && (isNaN(limit) || limit <= 0)) {
      return res.status(400).json({ success: false, message: 'Invalid limit parameter' });
  }

  try {
    const leaderboard = await quizService.getLeaderboard(limit);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  submitAttempt,
  submitFinal,
  getLeaderboard,
};
