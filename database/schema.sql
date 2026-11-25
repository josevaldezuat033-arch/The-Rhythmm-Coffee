SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS return_requests;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS support_tickets;
DROP VIEW IF EXISTS v_reporte_ventas;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS eventos_musicales;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
    id INT NOT NULL AUTO_INCREMENT,
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_productos_sku (sku),
    KEY idx_productos_categoria (categoria_id),
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE eventos_musicales (
    id INT NOT NULL AUTO_INCREMENT,
    artista VARCHAR(150) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'Próximamente',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categorias (id, nombre) VALUES
(1, 'Bebidas calientes'),
(2, 'Bebidas frías'),
(3, 'Postres y panadería'),
(4, 'Café en Grano');

INSERT INTO productos (sku, nombre, descripcion, precio, stock, categoria_id) VALUES
('CAF-001', 'Latte de Especialidad', 'Espresso con leche texturizada y arte latte', 65.00, 25, 1),
('CAF-002', 'Cappuccino Clásico', 'Espresso, leche y capa de espuma cremosa', 60.00, 30, 1),
('CAF-003', 'Americano de Origen', 'Café negro de grano selección de la casa', 45.00, 40, 1),
('CAF-004', 'Mocha de Olla', 'Espresso, chocolate artesanal y toque de canela', 70.00, 20, 1),
('CAF-005', 'Espresso Doble', 'Extracción intensa y equilibrada', 40.00, 50, 1),
('FRI-001', 'Cold Brew The Rhythm', 'Café infusionado en frío por 18 horas', 75.00, 20, 2),
('FRI-002', 'Iced Latte Vainilla', 'Espresso, leche fría y jarabe de vainilla natural', 70.00, 25, 2),
('FRI-003', 'Frappé Mocha Caramelo', 'Café blended con hielo, chocolate y caramelo', 80.00, 15, 2),
('FRI-004', 'Tisana Frutal Red Berries', 'Infusión refrescante de frutos rojos sin teína', 65.00, 30, 2),
('FRI-005', 'Matcha Tonic', 'Té matcha ceremonial con agua tónica y cítricos', 85.00, 18, 2),
('POS-001', 'Pay de Queso con Frutos Rojos', 'Artesanal de la casa estilo New York', 70.00, 15, 3),
('POS-002', 'Roll de Canela Glaseado', 'Suave, recién horneado con frosting de queso crema', 55.00, 20, 3),
('POS-003', 'Croissant de Mantequilla', 'Hojaldrado, crujiente y dorado a la perfección', 45.00, 25, 3),
('POS-004', 'Brownie de Chocolate Fudgy', 'Con nueces y trozos de chocolate de metate', 50.00, 22, 3),
('POS-005', 'Cheesecake de Maracuyá', 'Base crujiente con cobertura tropical', 75.00, 12, 3),
('GRN-001', 'Chiapas Soconusco (Tueste Medio)', '500g en grano entero o molido. Notas de caramelo y chocolate, acidez baja y final limpio; ideal para filtro o prensa francesa.', 270.00, 25, 4),
('GRN-002', 'Veracruz Xico Geisha (Proceso Lavado)', '500g en grano entero o molido. Taza limpia y delicada con notas amaderadas, albahaca y té verde, con acidez baja.', 480.00, 18, 4),
('GRN-003', 'Chiapas de Altura (Higo, Miel y Chocolate)', '500g en grano entero o molido. Dulzor natural con notas de higo, miel, chocolate y mandarina, y acidez málica media.', 295.00, 22, 4),
('GRN-004', 'Huatusco Veracruz (Tueste Medio Orgánico)', '500g en grano entero o molido. Origen artesanal de altura con balance entre cuerpo, acidez y notas frutales.', 220.00, 30, 4),
('GRN-005', 'Blend de la Casa (Arábica y Robusta)', '500g en grano entero o molido. Tueste medio con cuerpo marcado, crema densa y notas de cacao; ideal para espresso y bebidas con leche.', 240.00, 28, 4),
('GRN-006', 'Café de Origen Descafeinado', '500g en grano entero o molido. Perfil suave y balanceado sin cafeína, ideal para la tarde o sesiones musicales nocturnas.', 250.00, 20, 4);

INSERT INTO eventos_musicales (artista, genero, fecha, descripcion, estado) VALUES
('Trío Medianoche', 'Jazz', '2026-11-16 19:30:00', 'Piano, contrabajo y saxofón dialogan en una sesión de standards.', 'Hoy'),
('Luna Ribeiro', 'Bossa nova', '2026-11-19 20:30:00', 'Melodías suaves, ritmos brasileños e interpretación luminosa.', 'Próximamente'),
('Norte de Papel', 'Indie folk', '2026-11-23 19:00:00', 'Canciones de carretera, armonías a dos voces y guitarras.', 'Próximamente'),
('Gabriel Valdez', 'Música nostálgica y texturas retro', '2026-11-24 22:00:00', 'Una atmósfera sonora íntima con sintetizadores análogos, guitarras texturizadas y melodías que evocan memorias en VHS.', 'Próximamente'),
('Sofi Vázquez', 'Indie pop nostálgico', '2026-11-26 21:00:00', 'Melodías vocales suaves, guitarras cálidas y texturas análogas perfectas para la tarde en la cafetería.', 'Próximamente'),
('Maia Cuesta', 'Folk alternativo / Dream pop', '2026-11-27 21:00:00', 'Atmósferas espaciales con guitarra acústica, melancolía sutil y arreglos orgánicos muy íntimos.', 'Próximamente'),
('Los Macarons', 'Bossa nova e indie acústico', '2026-11-28 22:00:00', 'Voces dulces y arreglos ligeros ideales para acompañar una charla tranquila entre tazas de café.', 'Próximamente'),
('Cigarra', 'Folk acústico', '2026-11-29 21:00:00', 'Armonías de madera, cuerdas viajeras y un sonido muy hogareño y entrañable.', 'Próximamente');

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    role_id INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role_id),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carts (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_carts_user (user_id),
    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_cart_items_cart (cart_id),
    KEY idx_cart_items_product (product_id),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES productos (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT,
    folio VARCHAR(50) NOT NULL,
    user_id INT NULL,
    direccion_envio TEXT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    envio DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_orders_folio (folio),
    KEY idx_orders_user (user_id),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NULL,
    sku_snapshot VARCHAR(50) NOT NULL,
    nombre_snapshot VARCHAR(150) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (id),
    KEY idx_order_items_order (order_id),
    KEY idx_order_items_product (product_id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES productos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    proveedor VARCHAR(50) DEFAULT 'sandbox_simulador',
    referencia_token VARCHAR(100) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_payments_order (order_id),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_movements (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NULL,
    tipo VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_inventory_movements_product (product_id),
    CONSTRAINT fk_inventory_movements_product
        FOREIGN KEY (product_id) REFERENCES productos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (id, nombre) VALUES
(1, 'admin'),
(2, 'cliente');

INSERT INTO users (nombre, email, password_hash, role_id) VALUES
('Administrador The Rhythm', 'admin@therhythmcoffee.com', '$2b$10$X7v...hashdemostracion...', 1);

CREATE TABLE coupons (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    vigencia DATETIME NOT NULL,
    limite_usos INT DEFAULT 100,
    usos_actuales INT DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_coupons_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE shipments (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    paqueteria VARCHAR(100) DEFAULT 'Estafeta / DHL Express',
    guia_tracking VARCHAR(100) NOT NULL,
    costo_envio DECIMAL(10,2) NOT NULL,
    estado_envio VARCHAR(50) DEFAULT 'Preparando en sucursal',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_shipments_guia (guia_tracking),
    KEY idx_shipments_order (order_id),
    CONSTRAINT fk_shipments_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW v_reporte_ventas AS
SELECT
    o.id AS order_id,
    o.folio,
    u.nombre AS cliente,
    o.subtotal,
    o.envio,
    o.total,
    o.estado,
    o.created_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

INSERT INTO coupons (codigo, tipo, valor, vigencia, limite_usos) VALUES
('RHYTHM10', 'porcentaje', 10.00, '2026-12-31 23:59:59', 50);

CREATE TABLE support_tickets (
    id INT NOT NULL AUTO_INCREMENT,
    folio_ticket VARCHAR(50) NOT NULL,
    user_id INT NULL,
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'Abierto',
    prioridad VARCHAR(20) DEFAULT 'Media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_support_tickets_folio (folio_ticket),
    KEY idx_support_tickets_user (user_id),
    CONSTRAINT fk_support_tickets_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faqs (
    id INT NOT NULL AUTO_INCREMENT,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'General',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO faqs (id, pregunta, respuesta, categoria) VALUES
(1, '¿Cuál es el tiempo de entrega de mi café?', 'Los pedidos locales se entregan en 24-48 horas y envíos nacionales en 3-5 días hábiles.', 'Envíos'),
(2, '¿Qué hago si mi paquete llega dañado?', 'Reporta el incidente dentro de las primeras 48 horas con una foto en nuestra sección de devoluciones o soporte.', 'Garantías'),
(3, '¿Es seguro ingresar los datos de mi tarjeta?', 'Sí, utilizamos pasarelas cifradas en modo Sandbox y por seguridad NUNCA solicitamos CVV por chat o correo.', 'Seguridad');

CREATE TABLE return_requests (
    id INT NOT NULL AUTO_INCREMENT,
    folio_devolucion VARCHAR(50) NOT NULL,
    order_id INT NOT NULL,
    user_id INT NULL,
    tipo_solicitud VARCHAR(50) NOT NULL,
    motivo TEXT NOT NULL,
    evidencia_url TEXT,
    estado VARCHAR(30) DEFAULT 'Solicitado',
    resolucion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_return_requests_folio (folio_devolucion),
    KEY idx_return_requests_order (order_id),
    KEY idx_return_requests_user (user_id),
    CONSTRAINT fk_return_requests_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_return_requests_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO categorias (id, nombre) VALUES (4, 'Café en Grano');

DELETE FROM productos WHERE sku LIKE 'GRN-%';

INSERT INTO productos (sku, nombre, descripcion, precio, stock, categoria_id) VALUES
('GRN-001', 'Chiapas Soconusco (Tueste Medio)', '500g en grano entero o molido. Notas de caramelo y chocolate, acidez baja y final limpio; ideal para filtro o prensa francesa.', 270.00, 25, 4),
('GRN-002', 'Veracruz Xico Geisha (Proceso Lavado)', '500g en grano entero o molido. Taza limpia y delicada con notas amaderadas, albahaca y té verde, con acidez baja.', 480.00, 18, 4),
('GRN-003', 'Chiapas de Altura (Higo, Miel y Chocolate)', '500g en grano entero o molido. Dulzor natural con notas de higo, miel, chocolate y mandarina, y acidez málica media.', 295.00, 22, 4),
('GRN-004', 'Huatusco Veracruz (Tueste Medio Orgánico)', '500g en grano entero o molido. Origen artesanal de altura con balance entre cuerpo, acidez y notas frutales.', 220.00, 30, 4),
('GRN-005', 'Blend de la Casa (Arábica y Robusta)', '500g en grano entero o molido. Tueste medio con cuerpo marcado, crema densa y notas de cacao; ideal para espresso y bebidas con leche.', 240.00, 28, 4),
('GRN-006', 'Café de Origen Descafeinado', '500g en grano entero o molido. Perfil suave y balanceado sin cafeína, ideal para la tarde o sesiones musicales nocturnas.', 250.00, 20, 4);