
const db = require('../db');

const getQuizSettings = async () => {
  try {
    const result = await db.query('SELECT is_open FROM quiz_settings ORDER BY id LIMIT 1');
    return result.rows[0];
  } catch (error) {
    console.error('Error in getQuizSettings service', error);
    throw error;
  }
};

const updateQuizSettings = async ({ is_open }) => {
  try {
    const result = await db.query(
      'UPDATE quiz_settings SET is_open = $1 WHERE id = (SELECT id FROM quiz_settings ORDER BY id LIMIT 1) RETURNING *'
      ,
      [is_open]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateQuizSettings service', error);
    throw error;
  }
};

module.exports = {
  getQuizSettings,
  updateQuizSettings,
};
