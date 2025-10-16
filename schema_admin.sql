
-- Table for quiz settings
CREATE TABLE quiz_settings (
    id SERIAL PRIMARY KEY,
    is_open BOOLEAN NOT NULL DEFAULT false,
    countdown_start TIMESTAMP WITH TIME ZONE,
    countdown_end TIMESTAMP WITH TIME ZONE
);

-- Insert a default row
INSERT INTO quiz_settings (is_open, countdown_start, countdown_end) VALUES (false, NULL, NULL);
