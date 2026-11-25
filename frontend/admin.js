const API_URL = 'http://localhost:3000/api';
let adminProducts = [];
let promoCodes = JSON.parse(localStorage.getItem('trc_promos')) || [
    { codigo: 'BIENVENIDA10', descuento: 10 },
    { codigo: 'VINILOCAFE15', descuento: 15 }
];

async function initAdmin() {
    await cargarProductosAdmin();
    cargarPedidosAdmin();
    renderPromos();
}

async function cargarProductosAdmin() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error('Error al cargar productos');
        adminProducts = await res.json();

        const tbody = document.getElementById('admin-products-table');
        let totalStock = 0;

        tbody.innerHTML = adminProducts.map(p => {
            totalStock += Number(p.stock || 0);
            return `
                <tr>
                    <td><strong>${p.sku || 'N/A'}</strong></td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria || 'General'}</td>
                    <td>$${Number(p.precio).toFixed(2)}</td>
                    <td>${p.stock ?? 0} uds.</td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="editarProducto(${p.id})">Editar</button>
                        <button class="btn-sm btn-danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('kpi-productos').textContent = adminProducts.length;
        document.getElementById('kpi-stock').textContent = totalStock;
    } catch (error) {
        console.error(error);
        document.getElementById('admin-products-table').innerHTML = '<tr><td colspan="6">Error conectando al servidor backend.</td></tr>';
    }
}

async function guardarProducto(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const payload = {
        sku: document.getElementById('prod-sku').value,
        nombre: document.getElementById('prod-nombre').value,
        categoria: document.getElementById('prod-categoria').value,
        precio: parseFloat(document.getElementById('prod-precio').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        descripcion: document.getElementById('prod-desc').value
    };

    try {
        const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(id ? 'Producto actualizado correctamente.' : 'Producto agregado al catálogo.');
            limpiarFormulario();
            cargarProductosAdmin();
        } else {
            const err = await res.json();
            alert('Nota del servidor: ' + (err.error || 'Verifica que tu backend tenga habilitada la ruta POST/PUT /api/products.'));
        }
    } catch (error) {
        console.error(error);
        alert('Error de red al guardar el producto.');
    }
}

function editarProducto(id) {
    const p = adminProducts.find(item => item.id === id);
    if (!p) return;

    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-sku').value = p.sku || '';
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-categoria').value = p.categoria || 'Cafe';
    document.getElementById('prod-precio').value = p.precio;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-desc').value = p.descripcion || '';

    document.getElementById('btn-save-prod').textContent = 'Actualizar Producto';
    document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

function limpiarFormulario() {
    document.getElementById('product-form').reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('btn-save-prod').textContent = 'Guardar Producto';
    document.getElementById('btn-cancel-edit').style.display = 'none';
}

async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto del inventario?')) return;
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cargarProductosAdmin();
        } else {
            alert('Verifica que la ruta DELETE /api/products/:id esté activa en tu backend.');
        }
    } catch (error) {
        console.error(error);
    }
}

// PEDIDOS Y REPORTES
function cargarPedidosAdmin() {
    const historial = JSON.parse(localStorage.getItem('trc_orders')) || [];
    const tbody = document.getElementById('admin-orders-table');

    document.getElementById('kpi-pedidos').textContent = historial.length;
    const totalIngresos = historial.reduce((acc, o) => acc + Number(o.total || 0), 0);
    document.getElementById('kpi-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;

    if (historial.length === 0) return;

    tbody.innerHTML = historial.map((o, idx) => `
        <tr>
            <td><strong>${o.folio}</strong></td>
            <td>${o.fecha}</td>
            <td>${o.direccion}</td>
            <td>$${Number(o.total).toFixed(2)}</td>
            <td><span class="badge">${o.estado}</span></td>
            <td>
                <select onchange="cambiarEstadoPedido(${idx}, this.value)">
                    <option value="Pagado (Sandbox)" ${o.estado === 'Pagado (Sandbox)' ? 'selected' : ''}>Pagado (Sandbox)</option>
                    <option value="En preparación" ${o.estado === 'En preparación' ? 'selected' : ''}>En preparación</option>
                    <option value="Enviado" ${o.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                    <option value="Entregado" ${o.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function cambiarEstadoPedido(index, nuevoEstado) {
    const historial = JSON.parse(localStorage.getItem('trc_orders')) || [];
    if (historial[index]) {
        historial[index].estado = nuevoEstado;
        localStorage.setItem('trc_orders', JSON.stringify(historial));
        cargarPedidosAdmin();
    }
}

// PROMOCIONES
function agregarCupon(e) {
    e.preventDefault();
    const codigo = document.getElementById('promo-code').value.toUpperCase().trim();
    const descuento = parseInt(document.getElementById('promo-discount').value);
    promoCodes.push({ codigo, descuento });
    localStorage.setItem('trc_promos', JSON.stringify(promoCodes));
    e.target.reset();
    renderPromos();
}

function renderPromos() {
    const div = document.getElementById('promo-list');
    div.innerHTML = promoCodes.map((p, i) => `
        <span class="badge" style="margin-right:0.5rem; display:inline-block; margin-bottom:0.5rem;">
            ${p.codigo} (${p.descuento}% OFF) 
            <strong style="cursor:pointer; margin-left:5px;" onclick="eliminarCupon(${i})">&times;</strong>
        </span>
    `).join('');
}

function eliminarCupon(index) {
    promoCodes.splice(index, 1);
    localStorage.setItem('trc_promos', JSON.stringify(promoCodes));
    renderPromos();
}

function exportarReporteCSV() {
    let csv = 'SKU,Nombre,Categoria,Precio,Stock\n';
    adminProducts.forEach(p => {
        csv += `"${p.sku || ''}","${p.nombre}","${p.categoria || ''}",${p.precio},${p.stock}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_inventario_therhythmcoffee.csv';
    link.click();
}

document.addEventListener('DOMContentLoaded', initAdmin);