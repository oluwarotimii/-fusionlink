-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_name VARCHAR(255),
  instructor_image_url TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  original_price DECIMAL(10, 2),
  discount_percentage INT DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  video_url TEXT,
  duration_hours DECIMAL(5, 2),
  total_lectures INT DEFAULT 0,
  total_sections INT DEFAULT 0,
  total_students INT DEFAULT 0,
  language VARCHAR(50) DEFAULT 'English',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255),
  reviewer_avatar_url TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create access_codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  used_by_user_id INT REFERENCES users(id),
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (email, username, password_hash, role, is_active)
VALUES ('admin@fsl.com', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, instructor_name, instructor_image_url, price, original_price, discount_percentage, category, image_url, duration_hours, total_lectures, total_sections, total_students, language, is_featured, is_active)
VALUES
('UI Design Masterclass', 'Learn professional UI design from scratch with industry experts', 'Adela Hummers', '/placeholder.svg?height=300&width=200', 24.99, 79.99, 20, 'Design', '/placeholder.svg?height=400&width=600', 12.5, 85, 22, 3400, 'English', true, true),
('JavaScript Course', 'Complete JavaScript course for beginners to advanced', 'Adrian Humm', '/placeholder.svg?height=300&width=200', 22.40, 30.13, 20, 'Development', '/placeholder.svg?height=400&width=600', 15.0, 152, 15, 2800, 'English', true, true),
('Mobile Dev React Native', 'Build mobile apps with React Native and JavaScript', 'Ava Humm', '/placeholder.svg?height=300&width=200', 23.09, 26.99, 20, 'Mobile', '/placeholder.svg?height=400&width=600', 14.0, 138, 18, 2200, 'English', true, true),
('Website Development', 'Full stack web development with modern tools', 'Adrian Website', '/placeholder.svg?height=300&width=200', 24.99, 25.99, 20, 'Development', '/placeholder.svg?height=400&width=600', 16.5, 176, 20, 3100, 'English', true, true),
('Design Thinking & Innovation', 'Masterclass in design thinking and innovation strategy', 'Ana Kursova', '/placeholder.svg?height=300&width=200', 25.92, 30.99, 15, 'Design', '/placeholder.svg?height=400&width=600', 20.0, 200, 25, 5000, 'English', true, true),
('Web Framework Basics', 'Learn modern web frameworks from fundamentals', 'Web Master', '/placeholder.svg?height=300&width=200', 22.12, 24.99, 12, 'Development', '/placeholder.svg?height=400&width=600', 18.0, 165, 22, 2900, 'English', false, true);
