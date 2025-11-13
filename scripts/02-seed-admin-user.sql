-- Ensure admin user exists with correct password hash
-- Password: admin123
-- Hash: SHA256("admin123" + "FSL_SECRET")
INSERT INTO users (email, username, password_hash, role, is_active)
VALUES ('admin@fsl.com', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', true)
ON CONFLICT (email) DO UPDATE SET password_hash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
