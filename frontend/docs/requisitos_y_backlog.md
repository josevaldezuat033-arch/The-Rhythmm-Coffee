# ☕ The Rhythm Coffee - Requisitos y Backlog (Fase I y II)
**Asignatura:** Comercio Electrónico  
**Docente:** Ing. Alfredo Medrano  

---

## 1. Requisitos Funcionales (RF)
* **RF-01 (Catálogo):** El sistema debe permitir consultar la lista de productos y eventos musicales ordenados por ID o fecha desde la base de datos[cite: 6].
* **RF-02 (Carrito de Compras):** El cliente debe poder agregar, modificar cantidades y eliminar artículos de su carrito de compras de manera interactiva[cite: 5, 8].
* **RF-03 (Checkout Transaccional):** El sistema debe validar stock en tiempo real, calcular totales en el servidor y procesar la orden generando un folio único (`TRC-XXXXXX`)[cite: 6, 8].
* **RF-04 (Gestión de Inventario):** Al confirmarse un pedido, el sistema debe descontar automáticamente las unidades vendidas de la tabla de productos en PostgreSQL[cite: 6, 8].
* **RF-05 (Panel Administrativo):** El administrador debe poder consultar todos los pedidos registrados y actualizar su estatus (ej. *pagado, enviado, entregado*)[cite: 6, 8].

---

## 2. Requisitos No Funcionales (RNF)
* **RNF-01 (Usabilidad):** Interfaz limpia, responsiva y adaptable a dispositivos móviles, tablets y escritorios[cite: 6].
* **RNF-02 (Seguridad):** Uso de consultas parametrizadas para prevenir inyecciones SQL, manejo de CORS en el backend y simulación segura de pagos (sandbox) sin almacenar datos sensibles de tarjetas[cite: 3, 10, 13].
* **RNF-03 (Rendimiento y Modularidad):** Arquitectura cliente-servidor desacoplada utilizando Node.js, Express y PostgreSQL con código modular y transacciones seguras (`BEGIN/COMMIT/ROLLBACK`)[cite: 3, 6, 8].

---

## 3. Historias de Usuario Prioritarias
1. **HU-01:** *"Como visitante, quiero explorar el catálogo de café y eventos para conocer la oferta del negocio."* (Criterio: Visualización en tarjetas con nombre, descripción y precio).
2. **HU-02:** *"Como cliente, quiero agregar productos al carrito y realizar el checkout para completar una compra de prueba."* (Criterio: Validación de stock y generación de folio).
3. **HU-03:** *"Como administrador, quiero ingresar al panel de control para consultar las órdenes y actualizar su estatus logístico."* (Criterio: Cambio de estatus reflejado en la base de datos).