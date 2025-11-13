-- Clear existing data to start fresh
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE enrollments CASCADE;
TRUNCATE TABLE access_codes CASCADE;
TRUNCATE TABLE courses CASCADE;

-- Insert admin user (password: admin123)
INSERT INTO users (email, username, password_hash, role, is_active)
VALUES ('admin@fsl.com', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses with YouTube links
INSERT INTO courses (title, description, instructor_name, instructor_image_url, price, original_price, discount_percentage, category, image_url, video_url, duration_hours, total_lectures, total_sections, total_students, language, is_featured, is_active)
VALUES
(
  'UI Design Masterclass',
  'Learn professional UI design from scratch with industry experts. Master the fundamentals of user interface design, typography, color theory, and modern design systems. Perfect for beginners and experienced designers looking to advance their skills.',
  'Adela Hummers',
  '/images/avatar1.jpg',
  24.99,
  79.99,
  68,
  'Design',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/7l8zA0LvQSU',
  12.5,
  85,
  22,
  3400,
  'English',
  true,
  true
),
(
  'The Complete JavaScript Course',
  'Complete JavaScript course for beginners to advanced developers. Learn ES6+, async programming, DOM manipulation, and build real-world projects. This comprehensive course covers everything you need to become a professional JavaScript developer.',
  'Adrian Humm',
  '/images/avatar2.jpg',
  22.40,
  30.13,
  26,
  'Development',
  'https://images.unsplash.com/photo-1633356122544-f134ef2944f1?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/W6NZfCO5tTE',
  15.0,
  152,
  15,
  2800,
  'English',
  true,
  true
),
(
  'Mobile Development with React Native',
  'Build cross-platform mobile apps with React Native and JavaScript. Learn to create iOS and Android applications with a single codebase. Master navigation, state management, APIs, and deploy your apps to the app stores.',
  'Ava Humm',
  '/images/avatar3.jpg',
  23.09,
  26.99,
  14,
  'Mobile',
  'https://images.unsplash.com/photo-1512941691920-25bdef299b53?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/ur6I5GQvWQA',
  14.0,
  138,
  18,
  2200,
  'English',
  true,
  true
),
(
  'Full Stack Web Development',
  'Complete guide to full stack web development. Learn frontend with React, backend with Node.js, and databases with PostgreSQL. Build complete production-ready applications from scratch to deployment.',
  'Adrian Website',
  '/images/avatar4.jpg',
  24.99,
  25.99,
  4,
  'Development',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/a_7Z7C_JCyo',
  16.5,
  176,
  20,
  3100,
  'English',
  true,
  true
),
(
  'Design Thinking & Innovation',
  'Masterclass in design thinking and innovation strategy. Learn human-centered design principles, prototyping techniques, and how to solve complex problems. Apply design thinking methodology to real-world challenges in your organization.',
  'Ana Kursova',
  '/images/avatar5.jpg',
  25.92,
  30.99,
  16,
  'Design',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/MxqvPW9QqsE',
  20.0,
  200,
  25,
  5000,
  'English',
  true,
  true
),
(
  'Web Frameworks Fundamentals',
  'Learn modern web frameworks from fundamentals. Master React, Vue, and Angular basics. Understand component architecture, state management, and routing. Build responsive, efficient web applications.',
  'Web Master',
  '/images/avatar6.jpg',
  22.12,
  24.99,
  11,
  'Development',
  'https://images.unsplash.com/photo-1633356122544-f134ef2944f1?w=600&h=400&fit=crop',
  'https://www.youtube.com/embed/2uZ7czvg2Hs',
  18.0,
  165,
  22,
  2900,
  'English',
  false,
  true
);

-- Insert reviews for each course
INSERT INTO reviews (course_id, reviewer_name, reviewer_email, reviewer_avatar_url, rating, comment)
VALUES
(1, 'Leonardo Da Vinci', 'leonardo@example.com', '/images/reviewer1.jpg', 5, 'Loved the course. I''ve learned very subtle techniques, especially on leaves.'),
(1, 'Titania Smith', 'titania@example.com', '/images/reviewer2.jpg', 4, 'I loved the course, it had been a long time since I experimented with watercolors and now I will do it more often thanks to this course.'),
(1, 'Zhirkov Alex', 'zhirkov@example.com', '/images/reviewer3.jpg', 5, 'Yes, I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow.'),

(2, 'Emma Wilson', 'emma@example.com', '/images/reviewer4.jpg', 5, 'Best JavaScript course I''ve taken. Clear explanations and great examples.'),
(2, 'James Cooper', 'james@example.com', '/images/reviewer5.jpg', 4, 'Very well structured, easy to follow for beginners. However, the explanations could be more detailed.'),
(2, 'Sophia Martinez', 'sophia@example.com', '/images/reviewer6.jpg', 5, 'Excellent course. I recommend it for anyone wanting to learn JavaScript properly.'),

(3, 'Michael Zhang', 'michael@example.com', '/images/reviewer7.jpg', 4, 'Great introduction to React Native. Covers all the basics well.'),
(3, 'Olivia Brown', 'olivia@example.com', '/images/reviewer8.jpg', 5, 'This course helped me transition from web to mobile development seamlessly.'),

(4, 'Daniel Garcia', 'daniel@example.com', '/images/reviewer9.jpg', 5, 'Comprehensive full stack course. Everything from frontend to backend is well explained.'),
(4, 'Isabella Rodriguez', 'isabella@example.com', '/images/reviewer10.jpg', 4, 'Good course, very practical with real-world examples.'),

(5, 'Lucas Anderson', 'lucas@example.com', '/images/reviewer11.jpg', 5, 'Exceptional masterclass. Changed my approach to problem-solving.'),
(5, 'Mia Thompson', 'mia@example.com', '/images/reviewer12.jpg', 5, 'The design thinking framework is incredibly useful for business.'),

(6, 'Nathan Harris', 'nathan@example.com', '/images/reviewer13.jpg', 4, 'Good fundamentals course for learning web frameworks.'),
(6, 'Amelia Clark', 'amelia@example.com', '/images/reviewer14.jpg', 5, 'Clear explanations and great structure. Perfect for beginners!');
