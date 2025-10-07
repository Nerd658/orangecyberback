
-- Table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    attempt_count INT DEFAULT 0,
    submitted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Example: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer VARCHAR(255) NOT NULL
);

-- Table for quiz attempts
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    score INT NOT NULL,
    time_taken INT NOT NULL, -- in seconds
    attempt_number INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for final results
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    score INT NOT NULL,
    time_taken INT NOT NULL, -- in seconds
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_results_user_id ON results(user_id);
CREATE INDEX idx_results_score_time ON results(score DESC, time_taken ASC);

