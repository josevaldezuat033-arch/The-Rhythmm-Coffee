let allProducts = [];
let allEvents = [];
let searchTerm = '';
let currentCategory = 'all';
let cart = JSON.parse(localStorage.getItem('trc_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('trc_user') || 'null');

const API_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api';

function getFallbackImage(title, tag = 'THE RHYTHM COFFEE', bg1 = '#3b141c', bg2 = '#6b2737', accent = '#f3d5b5', kind = 'generic') {
    const safeTitle = String(title || 'The Rhythm Coffee').slice(0, 26);
    const safeTag = String(tag || 'ESPECIALIDAD').slice(0, 22);

    let iconMarkup = `
        <rect x="445" y="115" width="90" height="75" rx="14" fill="none" stroke="${accent}" stroke-width="4" opacity="0.55"/>
        <path d="M535 130 h16 a18 18 0 0 1 0 36 h-16" fill="none" stroke="${accent}" stroke-width="4" opacity="0.55"/>
        <line x1="435" y1="202" x2="545" y2="202" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
    `;

    if (kind === 'hot-drink') {
        iconMarkup = `
            <path d="M448 122 h86 l-9 72 a18 18 0 0 1 -18 14 h-32 a18 18 0 0 1 -18 -14 z" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="4"/>
            <path d="M528 134 h15 a16 16 0 0 1 0 32 h-11" fill="none" stroke="${accent}" stroke-width="4"/>
            <path d="M472 104 q-8 -12 0 -24" fill="none" stroke="${accent}" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
            <path d="M495 104 q-8 -12 0 -24" fill="none" stroke="${accent}" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
            <ellipse cx="491" cy="148" rx="22" ry="11" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.7"/>
        `;
    } else if (kind === 'cold-drink') {
        iconMarkup = `
            <polygon points="452,116 530,116 516,208 466,208" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="4"/>
            <line x1="462" y1="146" x2="520" y2="146" stroke="${accent}" stroke-width="3" stroke-dasharray="6 5" opacity="0.8"/>
            <line x1="504" y1="116" x2="522" y2="82" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
            <rect x="470" y="124" width="16" height="16" rx="3" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2.5"/>
            <rect x="490" y="128" width="15" height="15" rx="3" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2.5"/>
        `;
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${bg1}"/>
                    <stop offset="100%" stop-color="${bg2}"/>
                </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#g)"/>
            <circle cx="515" cy="70" r="85" fill="${accent}" opacity="0.12"/>
            <circle cx="85" cy="300" r="110" fill="${accent}" opacity="0.10"/>
            ${iconMarkup}
            <rect x="28" y="28" width="544" height="304" rx="14" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
            <text x="48" y="72" fill="${accent}" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="bold" letter-spacing="2">${safeTag.toUpperCase()}</text>
            <text x="48" y="185" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="bold">${safeTitle}</text>
            <text x="48" y="225" fill="#fdf0ed" font-family="Segoe UI, Arial, sans-serif" font-size="18" opacity="0.88">The Rhythm Coffee • Café &amp; Música</text>
        </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getProductImage(p) {
    if (p && p.imagen_url && String(p.imagen_url).trim() !== '') {
        return p.imagen_url;
    }

    const sku = String(p.sku || '').toUpperCase();
    const text = `${p.nombre || ''} ${p.categoria || ''} ${sku}`.toLowerCase();

    const photoMap = {
        'CAF-001': 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        'CAF-002': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
        'CAF-003': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'CAF-004': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        'CAF-005': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
        'FRI-001': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        'FRI-002': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
        'FRI-003': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        'FRI-004': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        'FRI-005': 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80',
        'POS-001': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        'POS-002': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
        'POS-003': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        'POS-004': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        'POS-005': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
        'GRN-001': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        'GRN-002': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
        'GRN-003': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
        'GRN-004': 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
        'GRN-005': 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=800&q=80',
        'GRN-006': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        'ACC-001': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        'ACC-002': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'ACC-003': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        'ACC-004': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
    };

    if (photoMap[sku]) {
        return photoMap[sku];
    }

    if (sku.startsWith('FRI-') || text.includes('cold brew') || text.includes('iced') || text.includes('frappe') || text.includes('frappé') || text.includes('tonic') || text.includes('tisana')) {
        return 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80';
    }

    if (sku.startsWith('CAF-') || text.includes('latte') || text.includes('cappuccino') || text.includes('americano') || text.includes('mocha') || text.includes('espresso')) {
        return 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80';
    }

    if (sku.startsWith('POS-')) {
        return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80';
    }

    if (sku.startsWith('GRN-')) {
        return 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80';
    }

    return getFallbackImage(p.nombre, p.categoria || 'THE RHYTHM COFFEE', '#3b141c', '#2c1016', '#f3d5b5', 'generic');
}

function getEventImage(e) {
    if (e && e.imagen_url && String(e.imagen_url).trim() !== '') {
        return e.imagen_url;
    }

    const raw = `${e?.artista || ''} ${e?.titulo || ''} ${e?.genero || ''} ${e?.descripcion || ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (raw.includes('jazz') || raw.includes('vinil') || raw.includes('sax')) {
        return 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80';
    }
    if (raw.includes('rock') || raw.includes('banda') || raw.includes('vivo')) {
        return 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800&q=80';
    }
    if (raw.includes('acustic') || raw.includes('guitarra') || raw.includes('folk') || raw.includes('sesion')) {
        return 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80';
    }

    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
}

function injectHeroAndAtmosphere() {
    const hero = document.querySelector('.hero-section');
    if (hero && !document.getElementById('cafe-atmosphere-strip')) {
        const strip = document.createElement('div');
        strip.id = 'cafe-atmosphere-strip';
        strip.className = 'atmosphere-strip';
        strip.innerHTML = `
            <div class="atmosphere-card">
                <img src="${getFallbackImage('Barra de Especialidad', 'ESPRESSO & EXTRACCIÓN', '#3b141c', '#6b2737', '#f3d5b5', 'hot-drink')}" alt="Barra de café de especialidad">
                <span>Barra de Especialidad</span>
            </div>
            <div class="atmosphere-card">
                <img src="${getFallbackImage('Granos de Origen', 'TUESTE ARTESANAL', '#2c1016', '#4a2511', '#d4a373', 'generic')}" alt="Granos de café recién tostados">
                <span>Granos de Origen</span>
            </div>
            <div class="atmosphere-card">
                <img src="${getFallbackImage('Sesiones en Vivo', 'VINILOS & ACÚSTICA', '#3b141c', '#2c1016', '#e6b89c', 'generic')}" alt="Ambiente de música en vivo y vinilos">
                <span>Sesiones en Vivo</span>
            </div>
        `;
        hero.appendChild(strip);
    }
}

async function loadData() {
    updateUserUI();
    updateCartUI();
    injectHeroAndAtmosphere();

    try {
        const prodResponse = await fetch(`${API_URL}/products`);
        if (!prodResponse.ok) throw new Error('Error al obtener productos');
        allProducts = await prodResponse.json();

        const eventResponse = await fetch(`${API_URL}/events`);
        if (eventResponse.ok) {
            allEvents = await eventResponse.json();
        }

        setupFilters();
        applyFilters();
        renderEvents(allEvents);
    } catch (error) {
        console.error('Error API:', error);
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = '<p style="color:#3b141c; font-weight:bold;">Error al conectar con el servidor backend. Verifica que esté encendido.</p>';
        }
    }
}

function renderEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    eventsContainer.classList.add('grid');

    if (!events || events.length === 0) {
        eventsContainer.innerHTML = '<p>No hay eventos musicales programados por el momento.</p>';
        return;
    }

    eventsContainer.innerHTML = events.map((e, idx) => {
        const fechaTexto = e.fecha_evento || e.fecha || 'Sesión programada en cafetería';
        const horarioTexto = e.horario || '19:30 hrs • Ambiente íntimo';
        const cupoTexto = (e.capacidad_max != null)
            ? `${Math.max(0, Number(e.capacidad_max) - Number(e.asientos_reservados || 0))} lugares disponibles`
            : 'Cupo limitado';
        const fallbackEvt = getFallbackImage(e.artista || e.titulo || 'Sesión Acústica', e.genero || 'MÚSICA EN VIVO', '#2c1016', '#5c1d29', '#f3d5b5', 'generic');

        return `
            <div class="card event-card">
                <img class="card-img" src="${getEventImage(e)}" alt="${e.artista || e.titulo || 'Artista invitado'}" onerror="this.onerror=null;this.src='${fallbackEvt}';">
                <div class="card-body">
                    <small style="color:#666;"><strong>Género:</strong> ${e.genero || 'Acústico'}</small>
                    <h3>${e.artista || e.titulo}</h3>
                    <p>${e.descripcion || 'Presentación acústica en vivo acompañada de café de especialidad.'}</p>
                    <div class="event-specs">
                        <div><strong>Fecha:</strong> ${fechaTexto}</div>
                        <div><strong>Horario:</strong> ${horarioTexto}</div>
                        <div><strong>Disponibilidad:</strong> ${cupoTexto}</div>
                    </div>
                    <div class="card-footer-row">
                        <span class="badge">${e.estado || 'Próximamente'}</span>
                        <button class="btn-secondary btn-sm" onclick="verDetalleEvento(${idx})">Ver Cartelera</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalleEvento(index) {
    const e = allEvents[index];
    if (!e) return;
    const modalBody = document.getElementById('modal-product-body');
    if (!modalBody) return;
    const fallbackEvt = getFallbackImage(e.artista || e.titulo || 'Sesión Acústica', e.genero || 'MÚSICA EN VIVO', '#2c1016', '#5c1d29', '#f3d5b5', 'generic');

    modalBody.innerHTML = `
        <img class="modal-img" src="${getEventImage(e)}" alt="${e.artista || e.titulo}" onerror="this.onerror=null;this.src='${fallbackEvt}';">
        <span class="badge">${e.genero || 'Sesión Acústica'}</span>
        <h2 style="margin-top:0.5rem;">${e.artista || e.titulo}</h2>
        <p>${e.descripcion || 'Sesión musical en vivo en The Rhythm Coffee.'}</p>
        <p><strong>Fecha:</strong> ${e.fecha_evento || e.fecha || 'Por confirmar en cartelera'}</p>
        <p><strong>Horario:</strong> ${e.horario || '19:30 hrs'}</p>
        <p><strong>Estado:</strong> ${e.estado || 'Próximamente'}</p>
        <button class="btn-primary" onclick="cerrarModal('product-modal')">Cerrar ficha</button>
    `;
    document.getElementById('product-modal').style.display = 'block';
}

function matchesCategory(product, category) {
    if (!category || category === 'all') return true;

    const norm = (str) => String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const cat = norm(product.categoria || product.nombre_categoria || '');
    const nombre = norm(product.nombre);
    const desc = norm(product.descripcion);
    const sku = norm(product.sku);
    const catId = Number(product.categoria_id);
    const sel = norm(category);

    if (sel.includes('bebida')) {
        return (
            sku.startsWith('caf-') ||
            sku.startsWith('fri-') ||
            cat.includes('bebida')
        );
    }

    if (sel.includes('postre')) {
        return (
            sku.startsWith('pos-') ||
            cat.includes('postre') ||
            cat.includes('panaderia') ||
            nombre.includes('pay') ||
            nombre.includes('roll') ||
            nombre.includes('croissant') ||
            nombre.includes('brownie') ||
            nombre.includes('cheesecake')
        );
    }

    if (sel.includes('grano') || sel === 'cafe') {
        return (
            catId === 4 ||
            sku.startsWith('grn-') ||
            cat.includes('grano') ||
            nombre.includes('en grano') ||
            desc.includes('grano entero')
        );
    }

    if (sel.includes('accesorio')) {
        return (
            catId === 5 ||
            sku.startsWith('acc-') ||
            cat.includes('accesorio') ||
            nombre.includes('accesorio') ||
            nombre.includes('vinil') ||
            nombre.includes('prensa') ||
            nombre.includes('molino')
        );
    }

    if (sel.includes('musica') || sel.includes('experiencia')) {
        return (
            sku.startsWith('mus-') ||
            sku.startsWith('exp-') ||
            cat.includes('musica') ||
            cat.includes('experiencia')
        );
    }

    return cat.includes(sel);
}

function renderProducts(productsToRender, isMusicTab = false) {
    const productsContainer = document.getElementById('products-container');
    const eventsSection = document.getElementById('events-section') || document.getElementById('events-container')?.closest('.section');
    if (!productsContainer) return;

    productsContainer.classList.add('grid');

    if (eventsSection) {
        if (isMusicTab) {
            eventsSection.style.display = 'block';
            eventsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (currentCategory !== 'all') {
            eventsSection.style.display = 'none';
        } else {
            eventsSection.style.display = 'block';
        }
    }

    if (isMusicTab && (!productsToRender || productsToRender.length === 0)) {
        productsContainer.innerHTML = `
            <div class="info-banner" style="grid-column: 1 / -1;">
                <strong>Cartelera de Experiencias y Música en Vivo:</strong> Consulta abajo los artistas, géneros, horarios y detalles de cada sesión acústica.
            </div>
        `;
        return;
    }

    if (!productsToRender || productsToRender.length === 0) {
        productsContainer.innerHTML = '<p class="no-results">No se encontraron productos con esos criterios.</p>';
        return;
    }

    productsContainer.innerHTML = productsToRender.map(p => {
        const sinStock = Number(p.stock) <= 0;
        const fallbackProd = getFallbackImage(p.nombre, p.categoria || 'THE RHYTHM COFFEE', '#3b141c', '#6b2737', '#f3d5b5', 'generic');
        return `
        <div class="card product-card">
            <img class="card-img" src="${getProductImage(p)}" alt="${p.nombre}" onerror="this.onerror=null;this.src='${fallbackProd}';">
            <div class="card-body">
                <small style="color:#666;">SKU: ${p.sku || 'N/A'} | Stock: ${p.stock ?? 'Disponible'}</small>
                <h3>${p.nombre}</h3>
                <p>${p.descripcion || ''}</p>
                <span class="price"><strong>$${Number(p.precio).toFixed(2)} MXN</strong></span>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="verDetalleProducto(${p.id})">Ver Detalle</button>
                    <button class="btn-add" ${sinStock ? 'disabled' : ''} onclick="addToCartById(${p.id})">
                        ${sinStock ? 'Agotado' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function verDetalleProducto(id) {
    const p = allProducts.find(item => item.id === id);
    if (!p) return;

    const modalBody = document.getElementById('modal-product-body');
    const fallbackProd = getFallbackImage(p.nombre, p.categoria || 'ESPECIALIDAD', '#3b141c', '#6b2737', '#f3d5b5', 'generic');
    modalBody.innerHTML = `
        <img class="modal-img" src="${getProductImage(p)}" alt="${p.nombre}" onerror="this.onerror=null;this.src='${fallbackProd}';">
        <span class="badge">${p.categoria || 'Especialidad'}</span>
        <h2 style="margin-top:0.5rem;">${p.nombre}</h2>
        <p><strong>SKU:</strong> ${p.sku || 'TRC-00' + p.id}</p>
        <p>${p.descripcion || 'Producto artesanal seleccionado de The Rhythm Coffee.'}</p>
        <p><strong>Disponibilidad:</strong> ${p.stock > 0 ? p.stock + ' unidades en existencia' : 'Agotado'}</p>
        <p><strong>Especificaciones:</strong> Presentación estándar / Empaque sellado.</p>
        <h3 style="color:#3b141c;">$${Number(p.precio).toFixed(2)} MXN <small>(IVA incluido)</small></h3>
        <button class="btn-primary" ${p.stock <= 0 ? 'disabled' : ''} onclick="addToCartById(${p.id}); cerrarModal('product-modal')">
            Agregar al Carrito
        </button>
    `;
    document.getElementById('product-modal').style.display = 'block';
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput && !searchInput.dataset.bound) {
        searchInput.dataset.bound = 'true';
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            applyFilters();
        });
    }

    if (sortSelect && !sortSelect.dataset.bound) {
        sortSelect.dataset.bound = 'true';
        sortSelect.addEventListener('change', () => applyFilters());
    }

    filterBtns.forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = 'true';
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.getAttribute('data-category') || 'all';
            applyFilters();
        });
    });
}

function applyFilters() {
    let filtered = [...allProducts];
    const catLower = currentCategory.toLowerCase();
    const isMusicTab = catLower.includes('musica') || catLower.includes('experiencia');

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => matchesCategory(p, currentCategory));
    }

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm)) ||
            (p.sku && p.sku.toLowerCase().includes(searchTerm)) ||
            (p.categoria && p.categoria.toLowerCase().includes(searchTerm))
        );
    }

    const sortVal = document.getElementById('sort-select')?.value;
    if (sortVal === 'price-asc') filtered.sort((a, b) => Number(a.precio) - Number(b.precio));
    if (sortVal === 'price-desc') filtered.sort((a, b) => Number(b.precio) - Number(a.precio));

    renderProducts(filtered, isMusicTab);
}

// CARRITO CON CANTIDADES EDITABLES Y PERSISTENCIA
function addToCartById(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    saveAndRefreshCart();
}

function changeQty(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].cantidad += delta;
    if (cart[index].cantidad <= 0) {
        cart.splice(index, 1);
    }
    saveAndRefreshCart();
}

function saveAndRefreshCart() {
    localStorage.setItem('trc_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const navCount = document.getElementById('nav-cart-count');

    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    if (navCount) navCount.textContent = totalItems;

    if (!cartContainer || !totalSpan || !checkoutBtn) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        totalSpan.textContent = '0.00';
        checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        const subtotal = Number(item.precio) * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>$${Number(item.precio).toFixed(2)} c/u</small>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span style="margin: 0 8px;">${item.cantidad}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                    <strong style="margin-left: 15px;">$${subtotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
    }).join('');

    totalSpan.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;
    checkoutBtn.onclick = procesarCheckout;
}

// CHECKOUT CON RESUMEN Y CONFIRMACIÓN
async function procesarCheckout() {
    if (cart.length === 0) return;

    const direccionEnvio = prompt('Ingresa tu dirección de envío (Calle, número y colonia):', 'Sucursal The Rhythm Coffee - Mostrador');
    if (!direccionEnvio) return;

    const resumenTexto = cart.map(i => `- ${i.nombre} (x${i.cantidad})`).join('\n');
    const totalActual = document.getElementById('cart-total').textContent;

    const confirmarPago = confirm(`RESUMEN DE TU PEDIDO:\n${resumenTexto}\n\nDirección: ${direccionEnvio}\nTotal a pagar: $${totalActual} MXN\n\n¿Aceptas los términos y deseas autorizar el pago en la pasarela Sandbox?`);
    if (!confirmarPago) return;

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser ? currentUser.id : 1,
                direccion_envio: direccionEnvio,
                items: cart.map(item => ({ id: item.id, cantidad: item.cantidad }))
            })
        });

        const resultado = await response.json();

        if (response.ok) {
            const historial = JSON.parse(localStorage.getItem('trc_orders')) || [];
            historial.push({ folio: resultado.folio, total: resultado.total, estado: resultado.estado, fecha: new Date().toLocaleDateString(), direccion: direccionEnvio });
            localStorage.setItem('trc_orders', JSON.stringify(historial));

            alert(`¡Compra realizada con éxito!\n\nFolio de seguimiento: ${resultado.folio}\nTotal pagado: $${resultado.total} MXN\nEstado: ${resultado.estado}`);
            cart = [];
            saveAndRefreshCart();
            loadData();
        } else {
            alert(`Error al procesar la compra: ${resultado.error}`);
            checkoutBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error checkout:', error);
        alert('Error de conexión con el servidor.');
        checkoutBtn.disabled = false;
    }
}

// CUENTA Y SEGUIMIENTO
function abrirModalCuenta() {
    document.getElementById('account-modal').style.display = 'block';
}
function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => { t.style.display = 'none'; });
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); });
    document.getElementById(tabId).style.display = 'block';
    if (typeof event !== 'undefined' && event && event.target) event.target.classList.add('active');
}
function manejarAuth(e) {
    e.preventDefault();
    const nombre = document.getElementById('auth-name').value || 'Cliente Melómano';
    const email = document.getElementById('auth-email').value;
    currentUser = { id: 1, nombre, email };
    localStorage.setItem('trc_user', JSON.stringify(currentUser));
    updateUserUI();
    alert(`¡Bienvenido, ${nombre}!`);
}
function cerrarSesion() {
    currentUser = null;
    localStorage.removeItem('trc_user');
    updateUserUI();
}
function updateUserUI() {
    const statusSpan = document.getElementById('user-status');
    const profileDiv = document.getElementById('user-profile-info');
    const authForm = document.getElementById('auth-form');
    if (currentUser) {
        if (statusSpan) statusSpan.textContent = currentUser.nombre;
        if (profileDiv) {
            profileDiv.style.display = 'block';
            document.getElementById('logged-user-name').textContent = `${currentUser.nombre} (${currentUser.email})`;
        }
        if (authForm) authForm.style.display = 'none';
    } else {
        if (statusSpan) statusSpan.textContent = 'Cuenta / Seguimiento';
        if (profileDiv) profileDiv.style.display = 'none';
        if (authForm) authForm.style.display = 'flex';
    }
}
function buscarPedido() {
    const folio = document.getElementById('tracking-folio').value.trim();
    const resDiv = document.getElementById('tracking-result');
    const historial = JSON.parse(localStorage.getItem('trc_orders')) || [];
    const encontrado = historial.find(o => o.folio === folio);

    if (encontrado) {
        resDiv.innerHTML = `
            <p><strong>Folio:</strong> ${encontrado.folio}</p>
            <p><strong>Fecha:</strong> ${encontrado.fecha}</p>
            <p><strong>Estado:</strong> <span class="badge">${encontrado.estado}</span></p>
            <p><strong>Dirección:</strong> ${encontrado.direccion}</p>
            <p><strong>Total:</strong> $${encontrado.total} MXN</p>
        `;
    } else {
        resDiv.innerHTML = '<p>No se encontró un pedido reciente con ese folio en este navegador. Verifica el código entregado al finalizar tu compra.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadData);