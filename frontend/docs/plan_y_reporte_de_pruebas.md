# ☕ The Rhythm Coffee - Plan y Reporte de Pruebas (Calidad y Seguridad)
**Asignatura:** Comercio Electrónico[cite: 1]  
**Docente:** Ing. Alfredo Medrano[cite: 1]  

---

## 1. Plan de Pruebas Funcionales e Integración
* **Pruebas Unitarias y de Servidor:** Verificación de cálculos de subtotal e importes totales realizados estrictamente en el backend (Node.js/Express), evitando manipulación desde el navegador[cite: 6, 10].
* **Pruebas de Integración (API y Base de Datos):** Validación del flujo de checkout conectando las peticiones HTTP (`POST /api/orders`) con transacciones seguras en PostgreSQL, asegurando la actualización automática de stock y la creación de folios únicos (`TRC-XXXXXX`)[cite: 6, 7, 8, 10].
* **Pruebas del Sistema (E2E):** Recorrido completo desde la exploración del catálogo en el frontend, la adición de artículos al carrito, el pago simulado (sandbox) y la posterior consulta y actualización de estatus desde el panel administrativo[cite: 6, 10].

---

## 2. Casos de Aceptación Obligatorios (Evidencias del Sistema)
1. **Búsqueda y Catálogo:** El usuario visualiza los productos y eventos musicales correctamente cargados desde la base de datos[cite: 4, 11].
2. **Control de Inventario:** El sistema valida la existencia en tiempo real e impide realizar compras si la cantidad solicitada supera el stock disponible en PostgreSQL[cite: 6, 11].
3. **Seguridad y Roles:** Las rutas y endpoints administrativos (`/api/admin/orders`) se encuentran restringidos, denegando el acceso a usuarios no autorizados[cite: 5, 10, 11].
4. **Cumplimiento Normativo:** Los apartados legales (Términos y Condiciones, Aviso de Privacidad y Políticas de Devolución) se encuentran accesibles y alineados a la LFPC y LFPDPPP[cite: 8, 11].