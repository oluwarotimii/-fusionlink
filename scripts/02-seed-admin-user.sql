-- Ensure admin user exists with correct password hash
-- Password: admin123
-- Hash: SHA256("admin123" + "FSL_SECRET")
INSERT INTO users (email, username, password_hash, role, is_active)
VALUES ('admin@fsl.com', 'admin', '6f61c7271cb93da7d25d10357c05b4cf22962e13af96bd49a9f14253fed10858', 'admin', true)
ON CONFLICT (email) DO UPDATE SET password_hash = '6f61c7271cb93da7d25d10357c05b4cf22962e13af96bd49a9f14253fed10858';
