-- Script para inicializar la base de datos Bank of America
-- Este script se ejecutará automáticamente con Prisma

-- Crear índices adicionales para mejor performance
CREATE INDEX IF NOT EXISTS idx_movements_account_date ON movements(accountId, createdAt);
CREATE INDEX IF NOT EXISTS idx_transfers_from_account ON transfers(fromAccountId);
CREATE INDEX IF NOT EXISTS idx_transfers_to_account ON transfers(toAccountId);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(accountNumber);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Crear vista para estadísticas rápidas
CREATE VIEW IF NOT EXISTS account_stats AS
SELECT 
    a.id,
    a.accountNumber,
    a.fullName,
    a.balance,
    COUNT(m.id) as total_movements,
    COUNT(CASE WHEN m.type = 'DEPOSIT' THEN 1 END) as deposits,
    COUNT(CASE WHEN m.type = 'WITHDRAWAL' THEN 1 END) as withdrawals,
    COUNT(CASE WHEN m.type LIKE 'TRANSFER%' THEN 1 END) as transfers
FROM accounts a
LEFT JOIN movements m ON a.id = m.accountId
GROUP BY a.id, a.accountNumber, a.fullName, a.balance;

-- Insertar datos de configuración del banco
INSERT OR IGNORE INTO bank_config (key, value) VALUES 
('bank_name', 'Bank of America'),
('daily_transfer_limit', '50000'),
('daily_withdrawal_limit', '10000'),
('min_balance', '0'),
('interest_rate_savings', '2.5'),
('interest_rate_credit', '18.5');
