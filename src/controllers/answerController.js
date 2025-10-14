
const answerService = require('../services/answerService');

const getAnswers = async (req, res) => {
  const { questionIds } = req.body;
  console.log('Received request for answers with questionIds:', questionIds);

  if (!questionIds || !Array.isArray(questionIds)) {
    console.error('Invalid request body:', req.body);
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }

  try {
    const answers = await answerService.getAnswers(questionIds);
    console.log('Successfully retrieved answers:', answers);
    res.status(200).json({ success: true, answers });
  } catch (error) {
    console.error('Error in getAnswers controller:', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération des réponses.' });
  }
};

module.exports = {
  getAnswers,
};
