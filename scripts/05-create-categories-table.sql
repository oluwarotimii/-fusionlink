-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories if the table is empty
INSERT INTO categories (name)
SELECT 'Development' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Development');

INSERT INTO categories (name)
SELECT 'Design' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Design');

INSERT INTO categories (name)
SELECT 'Mobile' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Mobile');

INSERT INTO categories (name)
SELECT 'Business' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Business');

INSERT INTO categories (name)
SELECT 'Marketing' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Marketing');
