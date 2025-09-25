
const db = require('../db');

const submitAttempt = async (username, answers, timeTaken) => {
  try {
    // 1. Get user and check attempt count
    const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length === 0) {
      return { success: false, message: 'Username non trouvé' };
    }
    const user = userQuery.rows[0];
    if (user.attempt_count >= 3) {
      return { success: false, message: 'Nombre maximal de tentatives atteint' };
    }

    // 2. Calculate score
    const questionIds = answers.map(a => a.questionId);
    const correctAnswersQuery = await db.query('SELECT id, correct_answer FROM questions WHERE id = ANY($1::int[])', [questionIds]);
    const correctAnswers = correctAnswersQuery.rows;
    let score = 0;
    for (const answer of answers) {
        const correctAnswer = correctAnswers.find(ca => ca.id === answer.questionId);
        if (correctAnswer && correctAnswer.correct_answer === answer.answer) {
            score++;
        }
    }

    // 3. Increment attempt count
    const newAttemptCount = user.attempt_count + 1;
    await db.query('UPDATE users SET attempt_count = $1 WHERE id = $2', [newAttemptCount, user.id]);

    // 4. Store attempt
    const attemptNumber = newAttemptCount;
    await db.query(
      'INSERT INTO attempts (user_id, score, time_taken, attempt_number) VALUES ($1, $2, $3, $4)',
      [user.id, score, timeTaken, attemptNumber]
    );

    // 5. Return result
    return {
      success: true,
      score,
      time_taken: timeTaken,
      attempt_number: attemptNumber,
      can_retry: newAttemptCount < 3,
    };
  } catch (error) {
    console.error('Error in submitAttempt service', error);
    throw error;
  }
};

const submitFinal = async (username) => {
  try {
    // 1. Get user
    const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length === 0) {
      return { success: false, message: 'Username non trouvé' };
    }
    const user = userQuery.rows[0];

    // 2. Get the last attempt
    const lastAttemptQuery = await db.query(
      'SELECT * FROM attempts WHERE user_id = $1 ORDER BY attempt_number DESC LIMIT 1',
      [user.id]
    );
    if (lastAttemptQuery.rows.length === 0) {
      return { success: false, message: 'Aucune tentative trouvée pour cet utilisateur' };
    }
    const lastAttempt = lastAttemptQuery.rows[0];

    // 3. Update results table
    await db.query(
      'INSERT INTO results (user_id, score, time_taken, submitted_at) VALUES ($1, $2, $3, NOW())',
      [user.id, lastAttempt.score, lastAttempt.time_taken]
    );

    // 4. Mark user as submitted
    await db.query('UPDATE users SET submitted = true WHERE id = $1', [user.id]);

    // 5. Calculate rank
    const rankQuery = await db.query(
        'WITH ranked_results AS (SELECT user_id, score, time_taken, RANK() OVER (ORDER BY score DESC, time_taken ASC) as rank FROM results) SELECT rank FROM ranked_results WHERE user_id = $1',
        [user.id]
    );
    const rank = rankQuery.rows[0].rank;

    // 6. Return result
    return {
      success: true,
      score: lastAttempt.score,
      time_taken: lastAttempt.time_taken,
      rank: parseInt(rank, 10),
    };
  } catch (error) {
    console.error('Error in submitFinal service', error);
    throw error;
  }
};

const getLeaderboard = async (limit) => {
  try {
    const query = `
      SELECT 
        u.username, 
        r.score, 
        r.time_taken, 
        RANK() OVER (ORDER BY r.score DESC, r.time_taken ASC) as rank
      FROM results r
      JOIN users u ON r.user_id = u.id
      WHERE u.submitted = true
      ORDER BY rank ASC
    `;

    const fullQuery = limit ? `${query} LIMIT $1` : query;
    const params = limit ? [limit] : [];

    const result = await db.query(fullQuery, params);
    
    const leaderboard = result.rows.map(row => ({
        ...row,
        rank: parseInt(row.rank, 10)
    }));

    return leaderboard;
  } catch (error) {
    console.error('Error in getLeaderboard service', error);
    throw error;
  }
};

module.exports = {
  submitAttempt,
  submitFinal,
  getLeaderboard,
};
