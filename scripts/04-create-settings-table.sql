-- Create settings table for bank details and WhatsApp settings
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    bank_name TEXT,
    account_number TEXT,
    transfer_instructions TEXT,
    whatsapp_number TEXT,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default row if the table is empty
INSERT INTO settings (bank_name, account_number, transfer_instructions, whatsapp_number, whatsapp_enabled)
SELECT 'Default Bank', '0000000000', 'Please contact support for payment instructions.', '+1234567890', FALSE
WHERE NOT EXISTS (SELECT 1 FROM settings);
