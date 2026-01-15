-- Add optional name fields for user profile
ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN last_name VARCHAR(100);

-- Index for potential future queries by name
CREATE INDEX idx_users_names ON users(first_name, last_name) WHERE first_name IS NOT NULL;