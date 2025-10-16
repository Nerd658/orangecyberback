
const db = require('../db');

const checkUsername = async (username) => {
  try {
    // Check if username exists
    const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];
      if (user.submitted) {
        return { success: false, message: 'Vous avez déjà finalisé votre participation.' };
      }
      return { success: true, isNewUser: false, user };
    }

    // Create user if not exists
    const newUserQuery = await db.query(
      'INSERT INTO users (username, attempt_count, submitted) VALUES ($1, 0, false) RETURNING *',
      [username]
    );
    return { success: true, isNewUser: true, user: newUserQuery.rows[0] };
  } catch (error) {
    console.error('Error in checkUsername service', error);
    throw error;
  }
};

const getUserCount = async () => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error in getUserCount service', error);
    throw error;
  }
};

const getUserRank = async (username) => {
  try {
    // 1. Get user
    const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length === 0) {
      return { success: false, message: 'Username non trouvé' };
    }
    const user = userQuery.rows[0];

    if (!user.submitted) {
        return { success: false, message: 'L\'utilisateur n\'a pas encore soumis de score final.' };
    }

    // 2. Calculate rank
    const rankQuery = await db.query(
      `WITH ranked_results AS (
        SELECT user_id, score, time_taken, RANK() OVER (ORDER BY score DESC, time_taken ASC) as rank 
        FROM results
      ) 
      SELECT r.score, r.time_taken, rr.rank 
      FROM results r
      JOIN ranked_results rr ON r.user_id = rr.user_id
      WHERE r.user_id = $1 
      ORDER BY r.submitted_at DESC
      LIMIT 1`,
      [user.id]
    );

    if (rankQuery.rows.length === 0) {
        return { success: false, message: 'Aucun résultat trouvé pour cet utilisateur.' };
    }

    const { score, time_taken, rank } = rankQuery.rows[0];

    // 3. Return result
    return {
      success: true,
      username,
      score,
      time_taken,
      rank: parseInt(rank, 10),
    };
  } catch (error) {
    console.error('Error in getUserRank service', error);
    throw error;
  }
};

module.exports = {
  checkUsername,
  getUserCount,
  getUserRank,
};
