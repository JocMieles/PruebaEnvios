-- Crear tabla de usuarios con roles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador inicial (Admin Creador)
INSERT INTO users (id, name, email, password, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Admin Creador',
    'admin@example.com',
    '$2a$10$G.6wGxhVr8zfjfMq6jvAI.nM7e6KgN.dI5e2N6kN7q1O1zjBzvM.y', -- Contraseña: Admin1234
    'admin'
);