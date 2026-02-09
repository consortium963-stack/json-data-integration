-- Create video_testimonials table
CREATE TABLE IF NOT EXISTS video_testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    video_type VARCHAR(20) NOT NULL CHECK (video_type IN ('upload', 'youtube', 'link')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX idx_video_testimonials_sort_order ON video_testimonials(sort_order);

-- Insert default testimonials
INSERT INTO video_testimonials (client_name, description, video_url, video_type, sort_order) 
VALUES 
    ('Клиент 1', 'Разблокировка за 3 дня', '', 'upload', 1),
    ('Клиент 2', 'Разблокировка за 5 дней', '', 'upload', 2),
    ('Клиент 3', 'Разблокировка за 2 дня', '', 'upload', 3);
