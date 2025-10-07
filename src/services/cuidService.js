const db = require('../db');

const saveCuid = async (cuid) => {
  try {
    const newCuidQuery = await db.query(
      'INSERT INTO cuids (cuid) VALUES ($1) RETURNING *',
      [cuid]
    );
    return { success: true, message: 'CUID enregistré', cuid: newCuidQuery.rows[0] };
  } catch (error) {
    console.error('Error in saveCuid service', error);
    if (error.constraint === 'cuids_cuid_key') {
      return { success: false, message: 'CUID déjà existant' };
    }
    throw error;
  }
};

const getCuids = async () => {
  try {
    const allCuidsQuery = await db.query('SELECT * FROM cuids ORDER BY created_at ASC');
    return { success: true, cuids: allCuidsQuery.rows };
  } catch (error) {
    console.error('Error in getCuids service', error);
    throw error;
  }
};

module.exports = {
  saveCuid,
  getCuids,
};
