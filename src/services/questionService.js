
const db = require('../db');

const getQuestions = async () => {
  try {
    const result = await db.query(
      'SELECT id, question_text, options FROM questions ORDER BY RANDOM() LIMIT 10'
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getQuestions service', error);
    throw error;
  }
};

module.exports = {
  getQuestions,
};
