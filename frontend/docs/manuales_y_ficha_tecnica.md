# ☕ The Rhythm Coffee - Manuales y Ficha Técnica del Sistema
**Asignatura:** Comercio Electrónico[cite: 1]  
**Docente:** Ing. Alfredo Medrano[cite: 1]  

---

## 1. Ficha Técnica del Sistema
* **Nombre y versión:** The Rhythm Coffee v1.0.0
* **Descripción:** Plataforma web de comercio electrónico B2C para la venta de café de especialidad, accesorios y cartelera de eventos musicales en vivo[cite: 3, 12].
* **Arquitectura:** Cliente-Servidor desacoplada mediante API REST[cite: 2, 5, 12].
* **Frontend:** HTML5, CSS3 y JavaScript puro (Vanilla JS) con diseño responsivo[cite: 12].
* **Backend:** Node.js con framework Express.js y soporte CORS[cite: 12].
* **Base de datos:** PostgreSQL (esquema relacional normalizado con integridad referencial y transacciones)[cite: 2, 6, 12].
* **Seguridad:** Consultas parametrizadas contra inyección SQL, validación de precios y stock del lado del servidor, simulación de pagos (sandbox) sin almacenamiento de datos de tarjeta y gestión de variables mediante `.env`[cite: 5, 10, 12].

---

## 2. Manual de Instalación y Manual Técnico
1. **Requisitos previos:** Tener instalado Node.js (v18+) y PostgreSQL (v14+)[cite: 11].
2. **Configuración de Base de Datos:** Ejecutar el script SQL inicial en PostgreSQL para crear las tablas (`productos`, `eventos_musicales`, `orders`, `order_items`) y poblar los datos semilla[cite: 6, 12].
3. **Configuración del Backend:**
   * Posicionarse en la carpeta `backend/` e instalar dependencias ejecutando `npm install`[cite: 11].
   * Configurar el archivo `.env` con las credenciales locales de PostgreSQL y el puerto (`PORT=3000`)[cite: 10, 11].
4. **Ejecución:** Iniciar el servidor con `node index.js` y abrir `index.html` (tienda) o `admin.html` (panel administrativo) en el navegador[cite: 12].

---

## 3. Manual de Usuario (Comprador)
1. **Exploración:** Ingresar a la página principal (`index.html`) para visualizar el menú de café de especialidad y la cartelera de eventos musicales[cite: 4, 11].
2. **Carrito de Compras:** Hacer clic en el botón **"Agregar al Carrito"** en los productos deseados; el sistema calculará el total automáticamente[cite: 4, 11].
3. **Checkout y Confirmación:** Hacer clic en **"Proceder al Checkout"** para validar stock en tiempo real, descontar inventario y obtener el folio único de compra (`TRC-XXXXXX`)[cite: 6, 7, 11].

---

## 4. Manual de Usuario (Administrador)
1. **Acceso al Panel:** Abrir la vista administrativa (`admin.html`)[cite: 4, 11].
2. **Gestión de Pedidos:** Consultar la tabla de órdenes generadas con sus respectivos folios, montos y estatus actuales[cite: 5, 11].
3. **Actualización Logística:** Seleccionar un pedido y cambiar su estatus (por ejemplo, de *pagado* a *enviado*), guardando el cambio directamente en la base de datos[cite: 5, 7, 11].