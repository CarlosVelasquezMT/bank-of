-- Script para inicializar la base de datos Bank of America en Neon
-- Este script se ejecutará después de las migraciones de Prisma

-- Crear índices adicionales para mejor performance
CREATE INDEX IF NOT EXISTS idx_movements_account_date ON movements(accountId, createdAt);
CREATE INDEX IF NOT EXISTS idx_transfers_from_account ON transfers(fromAccountId);
CREATE INDEX IF NOT EXISTS idx_transfers_to_account ON transfers(toAccountId);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(accountNumber);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);

-- Crear índices para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_credits_status ON credits(status);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Crear vista para estadísticas rápidas
CREATE OR REPLACE VIEW account_stats AS
SELECT 
    a.id,
    a.accountNumber,
    a.fullName,
    a.balance,
    COUNT(m.id) as total_movements,
    COUNT(CASE WHEN m.type = 'DEPOSIT' THEN 1 END) as deposits,
    COUNT(CASE WHEN m.type = 'WITHDRAWAL' THEN 1 END) as withdrawals,
    COUNT(CASE WHEN m.type LIKE 'TRANSFER%' THEN 1 END) as transfers,
    COUNT(c.id) as total_credits,
    COUNT(l.id) as total_loans
FROM accounts a
LEFT JOIN movements m ON a.id = m.accountId
LEFT JOIN credits c ON a.id = c.accountId AND c.status = 'ACTIVE'
LEFT JOIN loans l ON a.id = l.accountId AND l.status = 'ACTIVE'
GROUP BY a.id, a.accountNumber, a.fullName, a.balance;

-- Crear vista para resumen financiero
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
    COUNT(DISTINCT a.id) as total_accounts,
    SUM(a.balance) as total_balance,
    SUM(CASE WHEN c.status = 'ACTIVE' THEN c.amount ELSE 0 END) as total_credits,
    SUM(CASE WHEN l.status = 'ACTIVE' THEN l.remaining ELSE 0 END) as total_loans,
    COUNT(DISTINCT m.id) as total_movements
FROM accounts a
LEFT JOIN credits c ON a.id = c.accountId
LEFT JOIN loans l ON a.id = l.accountId
LEFT JOIN movements m ON a.id = m.accountId;

-- Función para generar número de cuenta único
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generar número de cuenta con formato 10XXXXXXXX
        new_number := '10' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
        
        -- Verificar si ya existe
        SELECT COUNT(*) INTO exists_check 
        FROM accounts 
        WHERE accountNumber = new_number;
        
        -- Si no existe, salir del loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Función para generar código de referencia único
CREATE OR REPLACE FUNCTION generate_reference_code(prefix TEXT DEFAULT 'REF')
RETURNS TEXT AS $$
BEGIN
    RETURN prefix || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || 
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updatedAt automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las tablas que lo necesitan
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_credits_updated_at ON credits;
CREATE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loans_updated_at ON loans;
CREATE TRIGGER update_loans_updated_at
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios en las tablas
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema bancario';
COMMENT ON TABLE accounts IS 'Tabla de cuentas bancarias';
COMMENT ON TABLE movements IS 'Tabla de movimientos y transacciones';
COMMENT ON TABLE credits IS 'Tabla de créditos asignados';
COMMENT ON TABLE loans IS 'Tabla de préstamos';
COMMENT ON TABLE transfers IS 'Tabla de transferencias entre cuentas';
COMMENT ON TABLE bank_config IS 'Tabla de configuración del banco';

-- Insertar configuración inicial si no existe
INSERT INTO bank_config (key, value) VALUES 
('bank_name', 'Bank of America'),
('daily_transfer_limit', '50000'),
('daily_withdrawal_limit', '10000'),
('min_balance', '0'),
('interest_rate_savings', '2.5'),
('interest_rate_credit', '18.5')
ON CONFLICT (key) DO NOTHING;

COMMIT;
