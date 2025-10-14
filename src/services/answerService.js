
const db = require('../db');

const getAnswers = async (questionIds) => {
  console.log('Fetching answers from database for questionIds:', questionIds);
  try {
    const result = await db.query(
      'SELECT id as "questionId", correct_answer FROM questions WHERE id = ANY($1::int[])',
      [questionIds]
    );
    console.log('Successfully fetched answers from database:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error in getAnswers service', error);
    throw error;
  }
};

module.exports = {
  getAnswers,
};
