
const adminService = require('../services/adminService');

const verifyAdmin = (req, res, next) => {
  const secretKey = req.headers['authorization'];
  if (secretKey !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

const getSettings = async (req, res) => {
  try {
    const settings = await adminService.getQuizSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicSettings = async (req, res) => {
  try {
    const settings = await adminService.getQuizSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { is_open } = req.body;
    const settings = await adminService.updateQuizSettings({ is_open });
    req.io.emit('quiz_settings_updated', settings); // Emit WebSocket event
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyAdmin,
  getSettings,
  getPublicSettings,
  updateSettings,
};
