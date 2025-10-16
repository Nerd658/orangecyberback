
const userService = require('../services/userService');

const checkUsername = async (req, res) => {
  const { username } = req.body;
  const io = req.io;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    const result = await userService.checkUsername(username);
    if (result.success) {
      // Emit an event only when a new user is created
      if (result.isNewUser) {
        io.emit('user_registered', { username: result.user.username, attempt_count: result.user.attempt_count });
      }
      res.status(201).json(result);
    } else {
      res.status(409).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getUserRank = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    const result = await userService.getUserRank(username);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  checkUsername,
  getUserRank,
};
