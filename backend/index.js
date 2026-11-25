/* ==========================================
   THE RHYTHM COFFEE - SERVIDOR BACKEND OFICIAL
   ========================================== */

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a Base de Datos relacional MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'the_rhythm_coffee',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos MySQL:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL (ID hilo):', db.threadId);
});

// Middleware de Control de Acceso por Roles (RBAC)
function verificarAdmin(req, res, next) {
    const userRole = req.headers['x-user-role'];
    if (!userRole || userRole !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado: Se requieren privilegios de Administrador" });
    }
    next();
}

// Obtener productos del catálogo
app.get('/api/products', (req, res) => {
    const sql = `
        SELECT
            p.id,
            p.sku,
            p.nombre,
            p.descripcion,
            p.precio,
            p.stock,
            p.categoria_id,
            c.nombre AS categoria
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        ORDER BY p.id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(results);
    });
});

// Obtener eventos musicales
app.get('/api/events', (req, res) => {
    const sql = 'SELECT id, artista, genero, fecha, descripcion, estado FROM eventos_musicales ORDER BY fecha ASC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener eventos:', err);
            return res.status(500).json({ error: 'Error al obtener eventos' });
        }
        res.json(results);
    });
});

// Manejador compartido para crear/procesar orden con validación de precio, stock y transacción
function procesarOrden(req, res) {
    const rawItems = req.body.items || req.body.carrito || [];
    const userId = req.body.user_id || 1;
    const direccionEnvio = String(req.body.direccion_envio || '').trim();

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío' });
    }
    if (!direccionEnvio) {
        return res.status(400).json({ error: 'La dirección de envío es obligatoria' });
    }

    const cantidadesPorId = new Map();
    for (const item of rawItems) {
        const prodId = Number(item.id ?? item.producto_id ?? item.product_id);
        const cant = Number(item.cantidad ?? 1);
        if (!Number.isInteger(prodId) || prodId <= 0 || !Number.isInteger(cant) || cant <= 0) {
            return res.status(400).json({ error: 'Datos de producto o cantidad inválidos' });
        }
        cantidadesPorId.set(prodId, (cantidadesPorId.get(prodId) || 0) + cant);
    }

    const ids = Array.from(cantidadesPorId.keys());

    db.beginTransaction((txErr) => {
        if (txErr) {
            console.error('Error al iniciar transacción:', txErr);
            return res.status(500).json({ error: 'No se pudo iniciar la transacción del pedido' });
        }

        const placeholders = ids.map(() => '?').join(',');
        db.query(
            `SELECT id, sku, nombre, precio, stock FROM productos WHERE id IN (${placeholders}) FOR UPDATE`,
            ids,
            (selErr, rows) => {
                if (selErr) {
                    return db.rollback(() => {
                        console.error('Error al consultar productos:', selErr);
                        res.status(500).json({ error: 'Error al validar productos e inventario' });
                    });
                }

                if (!rows || rows.length !== ids.length) {
                    return db.rollback(() => {
                        res.status(400).json({ error: 'Uno o más productos no existen en el catálogo' });
                    });
                }

                let subtotalReal = 0;
                const partidas = [];

                for (const prod of rows) {
                    const cantSolicitada = cantidadesPorId.get(prod.id);
                    const stockActual = Number(prod.stock);
                    const precioReal = Number(prod.precio);

                    if (stockActual < cantSolicitada) {
                        return db.rollback(() => {
                            res.status(400).json({
                                error: `Inventario insuficiente para "${prod.nombre}". Disponible: ${stockActual}, solicitado: ${cantSolicitada}`
                            });
                        });
                    }

                    subtotalReal += precioReal * cantSolicitada;
                    partidas.push({
                        product_id: prod.id,
                        sku_snapshot: prod.sku,
                        nombre_snapshot: prod.nombre,
                        precio_unitario: precioReal,
                        cantidad: cantSolicitada
                    });
                }

                const envio = subtotalReal > 500 ? 0 : 99;
                const totalFinal = subtotalReal + envio;
                const folioPedido = `TRC-${Date.now().toString().slice(-6)}`;

                db.query(
                    `INSERT INTO orders (folio, user_id, direccion_envio, subtotal, envio, total, estado)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [folioPedido, userId, direccionEnvio, subtotalReal, envio, totalFinal, 'confirmado'],
                    (ordErr, ordResult) => {
                        if (ordErr) {
                            return db.rollback(() => {
                                console.error('Error al insertar pedido:', ordErr);
                                res.status(500).json({ error: 'Error al registrar el pedido' });
                            });
                        }

                        const orderId = ordResult.insertId;
                        let pendientes = partidas.length;
                        let falloStock = false;

                        const registrarMovimientosYPartidas = () => {
                            if (falloStock) return;

                            const valuesItems = partidas.map((p) => [
                                orderId,
                                p.product_id,
                                p.sku_snapshot,
                                p.nombre_snapshot,
                                p.precio_unitario,
                                p.cantidad
                            ]);

                            db.query(
                                `INSERT INTO order_items (order_id, product_id, sku_snapshot, nombre_snapshot, precio_unitario, cantidad)
                                 VALUES ?`,
                                [valuesItems],
                                (itemErr) => {
                                    if (itemErr) {
                                        return db.rollback(() => {
                                            console.error('Error al insertar partidas:', itemErr);
                                            res.status(500).json({ error: 'Error al guardar el detalle del pedido' });
                                        });
                                    }

                                    const valuesMovs = partidas.map((p) => [
                                        p.product_id,
                                        'salida_venta',
                                        p.cantidad,
                                        `Venta folio ${folioPedido}`
                                    ]);

                                    db.query(
                                        `INSERT INTO inventory_movements (product_id, tipo, cantidad, motivo)
                                         VALUES ?`,
                                        [valuesMovs],
                                        (movErr) => {
                                            if (movErr) {
                                                return db.rollback(() => {
                                                    console.error('Error al insertar movimiento de inventario:', movErr);
                                                    res.status(500).json({ error: 'Error al registrar el movimiento de inventario' });
                                                });
                                            }

                                            db.commit((comErr) => {
                                                if (comErr) {
                                                    return db.rollback(() => {
                                                        console.error('Error al hacer commit:', comErr);
                                                        res.status(500).json({ error: 'Error al confirmar la transacción' });
                                                    });
                                                }

                                                res.status(200).json({
                                                    success: true,
                                                    folio: folioPedido,
                                                    estado: 'confirmado',
                                                    subtotal: subtotalReal,
                                                    envio: envio,
                                                    total: totalFinal,
                                                    mensaje: 'Pedido procesado de forma segura mediante transacciones ACID'
                                                });
                                            });
                                        }
                                    );
                                }
                            );
                        };

                        for (const p of partidas) {
                            db.query(
                                `UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`,
                                [p.cantidad, p.product_id, p.cantidad],
                                (updErr, updRes) => {
                                    if (falloStock) return;
                                    if (updErr || !updRes || updRes.affectedRows === 0) {
                                        falloStock = true;
                                        return db.rollback(() => {
                                            res.status(400).json({
                                                error: `No se pudo descontar inventario para "${p.nombre_snapshot}"`
                                            });
                                        });
                                    }
                                    pendientes -= 1;
                                    if (pendientes === 0) {
                                        registrarMovimientosYPartidas();
                                    }
                                }
                            );
                        }
                    }
                );
            }
        );
    });
}

// Rutas de órdenes (compatible con /api/orders y /api/orders/secure-checkout)
app.post('/api/orders', procesarOrden);
app.post('/api/orders/secure-checkout', procesarOrden);

// Ruta protegida de administración
app.get('/api/admin/dashboard-seguro', verificarAdmin, (req, res) => {
    res.json({
        status: "success",
        mensaje: "Bienvenido al panel administrativo seguro de The Rhythm Coffee",
        estadisticas: { ventasTotales: 14500, pedidosActivos: 8 }
    });
});

// Iniciar servidor una sola vez
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de The Rhythm Coffee corriendo en http://localhost:${PORT}`);
});