-- Creacion tabla usuario
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
    '$2a$12$bKeJL59bpsK1eeSU6opXG.R.I6Vf7xMFV6uYw/S6/taK3O67CmDMa', -- Contraseña: Admin1234
    'admin'
);

-- Creacion tabla de envios
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    sender_address VARCHAR(255) NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    width DECIMAL(5,2) NOT NULL,
    length DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    status ENUM('En espera', 'Asignado', 'En tránsito', 'Entregado') DEFAULT 'En espera',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transporters (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  availableSpace INT NOT NULL, -- Espacio disponible en cm³
  originCity VARCHAR(100) NOT NULL,
  destinationCity VARCHAR(100) NOT NULL,
  currentCity VARCHAR(100) NOT NULL
);

INSERT INTO transporters (id, name, availableSpace, originCity, destinationCity, currentCity) VALUES
  (UUID(), 'Juan Pérez', 500000, 'Medellín', 'Bogotá', 'Medellín'),
  (UUID(), 'Carlos López', 700000, 'Cali', 'Barranquilla', 'Cali'),
  (UUID(), 'Ana García', 600000, 'Bogotá', 'Cartagena', 'Bogotá'),
  (UUID(), 'Luis Rodríguez', 800000, 'Barranquilla', 'Bogotá', 'Bogotá');