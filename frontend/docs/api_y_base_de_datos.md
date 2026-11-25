# ☕ The Rhythm Coffee - Documentación de API y Base de datos (Fases III y IV)
**Asignatura:** Comercio Electrónico  
**Docente:** Ing. Alfredo Medrano  

---

## 1. Documentación de API REST
El backend expone los siguientes endpoints bajo el prefijo base `/api`[cite: 7]:

* **`GET /api/products`**[cite: 7]
  * **Descripción:** Obtiene el catálogo completo de productos disponibles[cite: 6, 7].
  * **Código HTTP de éxito:** `200 OK`
* **`GET /api/events`**
  * **Descripción:** Obtiene la cartelera de eventos musicales ordenados por fecha[cite: 6].
  * **Código HTTP de éxito:** `200 OK`
* **`POST /api/orders`**[cite: 7]
  * **Descripción:** Procesa el carrito de compras, valida stock con transacciones seguras en PostgreSQL y genera un pedido con folio único[cite: 6, 8].
  * **Cuerpo de petición (Body JSON):** `{ "cliente_nombre": "String", "items": [{ "id": Number, "cantidad": Number }] }`
  * **Código HTTP de éxito:** `200 OK` (Devuelve el folio, total y estatus) / `400 Bad Request` si el carrito está vacío o no hay stock[cite: 6, 8].
* **`GET /api/admin/orders`**[cite: 7]
  * **Descripción:** Consulta todos los pedidos registrados para el panel administrativo[cite: 6, 7].
  * **Código HTTP de éxito:** `200 OK`
* **`PUT /api/admin/orders/:id/status`**[cite: 7]
  * **Descripción:** Actualiza el estatus logístico de un pedido específico (ej. *pagado, enviado*)[cite: 6, 7].
  * **Cuerpo de petición (Body JSON):** `{ "estado": "String" }`
  * **Código HTTP de éxito:** `200 OK` / `404 Not Found` si el pedido no existe.

---

## 2. Diccionario de Datos (PostgreSQL)
* **Tabla `productos`:** Almacena el inventario de la cafetería.
  * `id` (SERIAL, PK), `sku` (VARCHAR, Único), `nombre` (VARCHAR), `descripcion` (TEXT), `precio` (DECIMAL), `stock` (INTEGER).
* **Tabla `eventos_musicales`:** Almacena la cartelera de música en vivo.
  * `id` (SERIAL, PK), `artista` (VARCHAR), `genero` (VARCHAR), `descripcion` (TEXT), `fecha` (DATE), `estado` (VARCHAR).
* **Tabla `orders`:** Almacena los encabezados de los pedidos generados en el checkout[cite: 9].
  * `id` (SERIAL, PK), `folio` (VARCHAR, Único), `user_id` (INTEGER), `direccion_envio` (TEXT), `subtotal` (DECIMAL), `envio` (DECIMAL), `total` (DECIMAL), `estado` (VARCHAR), `created_at` (TIMESTAMP).
* **Tabla `order_items`:** Almacena el respaldo histórico (snapshot) de cada partida del pedido[cite: 8, 9].
  * `id` (SERIAL, PK), `order_id` (INTEGER, FK), `product_id` (INTEGER), `sku_snapshot` (VARCHAR), `nombre_snapshot` (VARCHAR), `precio_unitario` (DECIMAL), `cantidad` (INTEGER).