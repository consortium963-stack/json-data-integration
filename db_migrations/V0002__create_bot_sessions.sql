CREATE TABLE IF NOT EXISTS bot_sessions (
    chat_id BIGINT PRIMARY KEY,
    step VARCHAR(50) NOT NULL DEFAULT 'start',
    name TEXT,
    phone TEXT,
    problem TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);
