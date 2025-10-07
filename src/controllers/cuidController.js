const cuidService = require('../services/cuidService');

const saveCuid = async (req, res) => {
  const { cuid } = req.body;

  if (!cuid) {
    return res.status(400).json({ success: false, message: 'CUID is required' });
  }

  try {
    const result = await cuidService.saveCuid(cuid);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(409).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCuids = async (req, res) => {
  try {
    const result = await cuidService.getCuids();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  saveCuid,
  getCuids,
};
