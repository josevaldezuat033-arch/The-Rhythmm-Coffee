/* ==========================================
   MÓDULO 10.1: PRUEBAS UNITARIAS E INTEGRACIÓN (Jest + Supertest)
   ========================================== */

const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// Simulando el endpoint de cálculo de checkout seguro para pruebas unitarias
app.post('/api/test/calcular-total', (req, res) => {
    const { items, cupon } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío' });
    }

    let subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    let descuento = cupon === 'RHYTHM15' ? subtotal * 0.15 : 0;
    let envio = subtotal > 500 ? 0 : 99; // Envío gratis a partir de $500
    let total = (subtotal - descuento) + envio;

    res.json({
        subtotal: parseFloat(subtotal.toFixed(2)),
        descuento: parseFloat(descuento.toFixed(2)),
        envio: parseFloat(envio.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    });
});

// Caso de prueba unitaria simulado
describe('Pruebas Unitarias - Cálculos de Carrito y Descuentos', () => {
    
    test('Debe calcular correctamente el subtotal, envío de $99 y sin descuento', async () => {
        const response = await request(app)
            .post('/api/test/calcular-total')
            .send({
                items: [
                    { producto: 'Café Espresso', precio: 120, cantidad: 2 }
                ],
                cupon: ''
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.subtotal).toBe(240);
        expect(response.body.envio).toBe(99);
        expect(response.body.total).toBe(339);
    });

    test('Debe aplicar cupón del 15% y envío gratis si supera $500', async () => {
        const response = await request(app)
            .post('/api/test/calcular-total')
            .send({
                items: [
                    { producto: 'Café Grano Especial', precio: 300, cantidad: 2 }
                ],
                cupon: 'RHYTHM15'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.subtotal).toBe(600);
        expect(response.body.descuento).toBe(90); // 15% de 600
        expect(response.body.envio).toBe(0); // Envío gratis por superar 500
        expect(response.body.total).toBe(510);
    });
});

