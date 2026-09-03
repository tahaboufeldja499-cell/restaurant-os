/* ============================================================================
   Restaurant OS - Frontend App Core
   ========================================================================== */

const state = {
  restaurant: null,
  categories: [],
  products: [],
  tables: [],
  cart: [],
  selectedCategory: 'all',
  currentTableId: null,
  activeOrderId: null,
  isAdmin: false,
  adminData: null,
  pollingInterval: null
};

// ============================================================================
// Helper Utilities
// ============================================================================
async function api(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(endpoint, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'حدث خطأ في الاتصال بالسيرفر');
  }
  return data;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

function formatPrice(amount) {
  return `${amount} د.ج`;
}

function toast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerText = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function placeholderImg() {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
}

function openModal(overlayId, modalId) {
  document.getElementById(overlayId)?.classList.remove('hidden');
  document.getElementById(modalId)?.classList.remove('hidden');
}

function closeModal(overlayId, modalId) {
  document.getElementById(overlayId)?.classList.add('hidden');
  document.getElementById(modalId)?.classList.add('hidden');
}

function t(key) {
  const dict = {
    saved: "تم الحفظ بنجاح",
    confirmDelete: "هل أنت تأكد من الحذف؟",
    edit: "تعديل",
    delete: "حذف",
    addProduct: "إضافة منتج",
    addCategory: "إضافة تصنيف",
    addTable: "إضافة طاولة",
    noCategory: "بدون تصنيف",
    name: "الاسم",
    price: "السعر",
    category: "التصنيف",
    description: "الوصف",
    image: "الصورة",
    chooseImage: "اختر صورة",
    save: "حفظ"
  };
  return dict[key] || key;
}

// ============================================================================
// Initialization & Table Selection Handling
// ============================================================================
async function init() {
  // 1. فحص وجود رقم الطاولة في رابط الـ QR Code (?table=X)
  const urlParams = new URLSearchParams(window.location.search);
  const qrTable = urlParams.get('table');

  if (qrTable) {
    localStorage.setItem('restaurant_table_id', qrTable);
    state.currentTableId = Number(qrTable);
    // تنظيف الـ URL لجمالية الواجهة
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    state.currentTableId = localStorage.getItem('restaurant_table_id') ? Number(localStorage.getItem('restaurant_table_id')) : null;
  }

  // 2. استرجاع حالة طلب الزبون السابق إن وجد
  state.activeOrderId = localStorage.getItem('active_order_id') ? Number(localStorage.getItem('active_order_id')) : null;

  // 3. جلب البيانات العامة للمطعم
  try {
    const data = await api('/api/public');
    state.restaurant = data.restaurant;
    state.categories = data.categories;
    state.products = data.products;
    state.tables = data.tables;

    renderRestaurantInfo();

    // 4. التوجيه حسب اختيار الطاولة
    if (!state.currentTableId) {
      showTableSelectionModal();
    } else {
      hideTableSelectionModal();
      renderCategories();
      renderProducts();
    }

    // 5. بدء الـ Polling لمتابعة الطلبات النشطة للزبون
    if (state.activeOrderId) {
      startOrderPolling();
    }
  } catch (err) {
    toast(err.message, 'error');
  }
}

function showTableSelectionModal() {
  const modal = document.getElementById('table-modal-overlay');
  const select = document.getElementById('table-select');
  if (!modal || !select) return;

  select.innerHTML = '<option value="">-- اختر رقم الطاولة --</option>';
  state.tables.forEach(tb => {
    const opt = document.createElement('option');
    opt.value = tb.id;
    opt.textContent = `${tb.name} ${tb.status === 'occupied' ? '(مشغولة)' : ''}`;
    select.appendChild(opt);
  });

  modal.classList.remove('hidden');
  document.getElementById('btn-change-table')?.classList.add('hidden'); // إخفاء زر التغيير لمنع التعديل لاحقاً
}

function hideTableSelectionModal() {
  const modal = document.getElementById('table-modal-overlay');
  if (modal) modal.classList.add('hidden');
  
  // إخفاء خيارات تغيير الطاولة نهائياً لمنع التلاعب
  const changeBtn = document.getElementById('btn-change-table');
  if (changeBtn) changeBtn.style.display = 'none';

  const tableBadge = document.getElementById('current-table-badge');
  if (tableBadge && state.currentTableId) {
    const tb = state.tables.find(t => t.id === state.currentTableId);
    tableBadge.textContent = tb ? tb.name : `طاولة ${state.currentTableId}`;
    tableBadge.classList.remove('hidden');
  }
}

function confirmTableSelection() {
  const select = document.getElementById('table-select');
  const val = select ? select.value : null;

  if (!val) {
    toast('يرجى اختيار رقم الطاولة أولاً', 'error');
    return;
  }

  state.currentTableId = Number(val);
  localStorage.setItem('restaurant_table_id', val);
  hideTableSelectionModal();
  renderCategories();
  renderProducts();
  toast('تم تأكيد الطاولة بنجاح', 'success');
}

// ============================================================================
// Customer UI Rendering (Products, Cart & Orders)
// ============================================================================
function renderRestaurantInfo() {
  if (!state.restaurant) return;
  const title = document.getElementById('restaurant-title');
  const msg = document.getElementById('restaurant-msg');
  if (title) title.innerText = state.restaurant.name;
  if (msg) msg.innerText = state.restaurant.openingMessage;
}

function renderCategories() {
  const container = document.getElementById('categories-list');
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = `category-btn ${state.selectedCategory === 'all' ? 'active' : ''}`;
  allBtn.innerText = 'الكل';
  allBtn.onclick = () => {
    state.selectedCategory = 'all';
    renderCategories();
    renderProducts();
  };
  container.appendChild(allBtn);

  state.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${state.selectedCategory === cat.id ? 'active' : ''}`;
    btn.innerText = cat.name;
    btn.onclick = () => {
      state.selectedCategory = cat.id;
      renderCategories();
      renderProducts();
    };
    container.appendChild(btn);
  });
}

function renderProducts() {
  const container = document.getElementById('products-list');
  if (!container) return;
  container.innerHTML = '';

  const list = state.selectedCategory === 'all'
    ? state.products
    : state.products.filter(p => p.category_id === state.selectedCategory);

  if (list.length === 0) {
    container.innerHTML = '<p class="text-center">لا توجد منتجات متوفرة حالياً.</p>';
    return;
  }

  list.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card glass';
    card.innerHTML = `
      <img src="${prod.image || placeholderImg()}" class="product-img" alt="${escapeAttr(prod.name)}" />
      <div class="product-details">
        <h4 class="product-title">${escapeHtml(prod.name)}</h4>
        <p class="product-desc">${escapeHtml(prod.description)}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(prod.price)}</span>
          <button class="btn btn-primary btn-sm btn-add-cart">+ أضف</button>
        </div>
      </div>
    `;
    card.querySelector('.btn-add-cart').onclick = () => addToCart(prod);
    container.appendChild(card);
  });
}

function addToCart(product) {
  if (state.isAdmin) {
    toast('جلسة أدمن: نظام الطلب معطل', 'error');
    return;
  }
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  updateCartBadge();
  toast(`تمت إضافة ${product.name} إلى السلة`, 'success');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) {
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

function openCart() {
  if (state.isAdmin) return;
  const overlay = document.getElementById('cart-overlay');
  const modal = document.getElementById('cart-modal');
  const container = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-total-price');

  if (!container || !overlay || !modal) return;
  container.innerHTML = '';

  let total = 0;
  state.cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <div>${formatPrice(item.price)} × ${item.qty} = ${formatPrice(itemTotal)}</div>
      </div>
      <div class="cart-actions">
        <button class="btn btn-sm btn-ghost btn-minus">-</button>
        <span>${item.qty}</span>
        <button class="btn btn-sm btn-ghost btn-plus">+</button>
      </div>
    `;

    row.querySelector('.btn-minus').onclick = () => {
      item.qty--;
      if (item.qty <= 0) state.cart.splice(index, 1);
      updateCartBadge();
      openCart();
    };
    row.querySelector('.btn-plus').onclick = () => {
      item.qty++;
      updateCartBadge();
      openCart();
    };

    container.appendChild(row);
  });

  if (totalEl) totalEl.innerText = formatPrice(total);
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function closeCart() {
  closeModal('cart-overlay', 'cart-modal');
}

async function confirmOrder() {
  if (state.cart.length === 0) {
    toast('السلة فارغة!', 'error');
    return;
  }
  if (!state.currentTableId) {
    toast('يرجى تحديد رقم الطاولة أولاً', 'error');
    showTableSelectionModal();
    return;
  }

  const note = document.getElementById('order-note')?.value || '';
  const total = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  try {
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        tableId: state.currentTableId,
        items: state.cart,
        totalPrice: total,
        customerNote: note
      }
    });

    state.activeOrderId = res.order.id;
    localStorage.setItem('active_order_id', res.order.id);
    state.cart = [];
    updateCartBadge();
    closeCart();

    toast('تم إرسال طلبك بنجاح! جاري تحضيره.', 'success');
    startOrderPolling();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ============================================================================
// Order Polling & Notifications for Customer
// ============================================================================
function startOrderPolling() {
  if (state.pollingInterval) clearInterval(state.pollingInterval);

  state.pollingInterval = setInterval(async () => {
    if (!state.activeOrderId) {
      clearInterval(state.pollingInterval);
      return;
    }

    try {
      const res = await api(`/api/orders/${state.activeOrderId}/status`);
      
      // التنبيه في حالة وصل الطبق (Delivered)
      if (res.status === 'delivered') {
        showOrderDeliveredNotification();
      } else if (res.status === 'confirmed' || res.status === 'cancelled') {
        clearInterval(state.pollingInterval);
        state.activeOrderId = null;
        localStorage.removeItem('active_order_id');
        hideOrderNotification();
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, 4000); // كل 4 ثوانٍ
}

function showOrderDeliveredNotification() {
  let notifBox = document.getElementById('order-delivered-box');
  if (!notifBox) {
    notifBox = document.createElement('div');
    notifBox.id = 'order-delivered-box';
    notifBox.className = 'delivered-banner glass';
    notifBox.innerHTML = `
      <div class="banner-content">
        <span>🔔 وصل طلبك إلى الطاولة! نتمنى لك شهية طيبة.</span>
        <button id="btn-confirm-receipt" class="btn btn-success btn-sm">تأكيد الاستلام</button>
      </div>
    `;
    document.body.appendChild(notifBox);

    document.getElementById('btn-confirm-receipt').onclick = async () => {
      try {
        await api(`/api/orders/${state.activeOrderId}/confirm-receipt`, { method: 'POST' });
        toast('شكراً لك! تم إغلاق الطلب.', 'success');
        localStorage.removeItem('active_order_id');
        state.activeOrderId = null;
        notifBox.remove();
      } catch (e) {
        toast(e.message, 'error');
      }
    };
  }
}

function hideOrderNotification() {
  const notifBox = document.getElementById('order-delivered-box');
  if (notifBox) notifBox.remove();
}

// ============================================================================
// Admin Authentication & Control Panel
// ============================================================================
async function submitAdminCode() {
  const codeInput = document.getElementById('admin-passcode-input');
  const code = codeInput ? codeInput.value : '';

  try {
    const res = await api('/api/admin/login', { method: 'POST', body: { code } });
    state.isAdmin = true;
    localStorage.setItem('admin_token', res.token);
    closeModal('admin-login-overlay', 'admin-login-modal');
    
    // تعطيل وإخفاء خيارات السيرة لمنع الأدمن من الطلب
    document.getElementById('btn-cart')?.classList.add('hidden');
    
    showAdminDashboard();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function showAdminDashboard() {
  document.getElementById('customer-view')?.classList.add('hidden');
  document.getElementById('admin-dashboard')?.classList.remove('hidden');
  loadAdminData();
  loadOrders();
}

function goToCustomerHome() {
  document.getElementById('admin-dashboard')?.classList.add('hidden');
  document.getElementById('customer-view')?.classList.remove('hidden');
  if (!state.isAdmin) {
    document.getElementById('btn-cart')?.classList.remove('hidden');
  }
}

function switchAdminView(viewName) {
  document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(`admin-view-${viewName}`)?.classList.remove('hidden');
  document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

  if (viewName === 'orders') loadOrders();
  if (viewName === 'tables') renderAdminTables();
}

async function loadOrders() {
  try {
    const orders = await api('/api/admin/orders');
    renderOrders(orders);
  } catch (err) {
    toast(err.message, 'error');
  }
}

function renderOrders(ordersList) {
  const list = document.getElementById('admin-orders-list');
  if (!list) return;
  list.innerHTML = '';

  if (ordersList.length === 0) {
    list.innerHTML = '<p class="text-center">لا توجد طلبات حالياً.</p>';
    return;
  }

  ordersList.reverse().forEach(order => {
    const card = document.createElement('div');
    card.className = 'admin-card glass';
    
    const itemsHtml = order.items.map(i => `<li>${i.name} × ${i.qty} (${formatPrice(i.price * i.qty)})</li>`).join('');
    const tableObj = state.tables.find(t => t.id === order.tableId);

    card.innerHTML = `
      <div class="admin-card-header">
        <strong>رقم الطلب: #${order.id}</strong> | 
        <span>${tableObj ? tableObj.name : `طاولة ${order.tableId}`}</span>
      </div>
      <div class="admin-card-body">
        <ul>${itemsHtml}</ul>
        <div><strong>المجموع: ${formatPrice(order.totalPrice)}</strong></div>
        ${order.customerNote ? `<small>ملاحظة: ${escapeHtml(order.customerNote)}</small>` : ''}
      </div>
      <div class="admin-card-actions">
        <label>الحالة: </label>
        <select class="input input-sm order-status-select">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
          <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>قيد التحضير</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل (وصل الطبق)</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>تم الاستلام والإنهاء</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
        </select>
      </div>
    `;

    card.querySelector('.order-status-select').addEventListener('change', async (e) => {
      try {
        await api(`/api/admin/orders/${order.id}/status`, {
          method: 'PATCH',
          body: { status: e.target.value }
        });
        toast(t('saved'), 'success');
        loadOrders();
      } catch (err) {
        toast(err.message, 'error');
      }
    });

    list.appendChild(card);
  });
}

// ============================================================================
// Admin Data Loaders & Tables Management
// ============================================================================
async function loadAdminData() {
  try {
    const data = await api('/api/admin/data');
    state.adminData = data;
    state.tables = data.tables;
    renderAdminProducts();
    renderAdminCategories();
    renderAdminTables();
    populateAdminSettings();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function renderAdminProducts() {
  const list = document.getElementById('admin-products-list');
  if (!list || !state.adminData) return;
  list.innerHTML = '';

  state.adminData.products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'admin-card glass';
    card.innerHTML = `
      <div class="admin-card-body">
        <strong>${escapeHtml(p.name)}</strong>
        <div>${formatPrice(p.price)}</div>
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;
    card.querySelector('[data-action="edit"]').addEventListener('click', () => openProductEditor(p));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProduct(p.id));
    list.appendChild(card);
  });
}

function renderAdminCategories() {
  const list = document.getElementById('admin-categories-list');
  if (!list || !state.adminData) return;
  list.innerHTML = '';

  state.adminData.categories.forEach((cat) => {
    const card = document.createElement('div');
    card.className = 'admin-card glass';
    card.innerHTML = `
      <div class="admin-card-body">
        <strong>${escapeHtml(cat.name)}</strong>
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;
    card.querySelector('[data-action="edit"]').addEventListener('click', () => openCategoryEditor(cat));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteCategory(cat.id));
    list.appendChild(card);
  });
}

function renderAdminTables() {
  const list = document.getElementById('admin-tables-list');
  if (!list || !state.tables) return;
  list.innerHTML = '';

  state.tables.forEach((tb) => {
    const card = document.createElement('div');
    card.className = 'admin-card glass';
    const isOccupied = tb.status === 'occupied';

    card.innerHTML = `
      <div class="admin-card-body">
        <strong>${escapeHtml(tb.name)}</strong>
        <div>الحالة: <span class="badge ${isOccupied ? 'badge-danger' : 'badge-success'}">${isOccupied ? 'مشغولة' : 'فارغة'}</span></div>
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-sm ${isOccupied ? 'btn-success' : 'btn-ghost'}" data-action="toggle-status">
          ${isOccupied ? 'تحويل إلى فارغة' : 'تحويل إلى مشغولة'}
        </button>
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;

    card.querySelector('[data-action="toggle-status"]').addEventListener('click', () => toggleTableStatus(tb.id, isOccupied ? 'empty' : 'occupied'));
    card.querySelector('[data-action="edit"]').addEventListener('click', () => openTableEditor(tb));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTable(tb.id));
    list.appendChild(card);
  });
}

async function toggleTableStatus(tableId, newStatus) {
  try {
    await api(`/api/admin/tables/${tableId}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
    toast('تم تغيير حالة الطاولة', 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function populateAdminSettings() {
  if (!state.adminData || !state.adminData.restaurant) return;
  const res = state.adminData.restaurant;
  if (document.getElementById('setting-name')) document.getElementById('setting-name').value = res.name || '';
  if (document.getElementById('setting-phone')) document.getElementById('setting-phone').value = res.phone || '';
  if (document.getElementById('setting-address')) document.getElementById('setting-address').value = res.address || '';
  if (document.getElementById('setting-message')) document.getElementById('setting-message').value = res.openingMessage || '';
  if (document.getElementById('setting-open')) document.getElementById('setting-open').checked = !!res.open;
}

// ============================================================================
// Product, Category & Table Editors
// ============================================================================
function openProductEditor(product = null) {
  const isEdit = !!product;
  document.getElementById('form-modal-title').textContent = isEdit ? `${t('edit')} ${product.name}` : t('addProduct');
  const modalBody = document.getElementById('form-modal-body');

  const categories = (state.adminData && state.adminData.categories) || [];

  modalBody.innerHTML = `
    <div class="field-group">
      <label>${t('name')}</label>
      <input id="prod-name" class="input" value="${escapeAttr(product ? product.name : '')}" />
    </div>
    <div class="field-group">
      <label>${t('price')}</label>
      <input id="prod-price" type="number" class="input" value="${product ? product.price : ''}" />
    </div>
    <div class="field-group">
      <label>${t('category')}</label>
      <select id="prod-category" class="input">
        <option value="">${t('noCategory')}</option>
        ${categories.map(c => `<option value="${c.id}" ${product && product.category_id === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label>${t('description')}</label>
      <textarea id="prod-desc" class="input">${escapeHtml(product ? product.description : '')}</textarea>
    </div>
    <button id="btn-save-prod" class="btn btn-primary btn-block">${t('save')}</button>
  `;

  document.getElementById('btn-save-prod').addEventListener('click', async () => {
    const payload = {
      name: document.getElementById('prod-name').value,
      price: Number(document.getElementById('prod-price').value),
      categoryId: Number(document.getElementById('prod-category').value) || null,
      description: document.getElementById('prod-desc').value,
    };
    try {
      if (isEdit) {
        await api(`/api/admin/products/${product.id}`, { method: 'PUT', body: payload });
      } else {
        await api('/api/admin/products', { method: 'POST', body: payload });
      }
      toast(t('saved'), 'success');
      closeModal('form-overlay', 'form-modal');
      loadAdminData();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  openModal('form-overlay', 'form-modal');
}

async function deleteProduct(id) {
  if (!confirm(t('confirmDelete'))) return;
  try {
    await api(`/api/admin/products/${id}`, { method: 'DELETE' });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function openCategoryEditor(cat = null) {
  const isEdit = !!cat;
  document.getElementById('form-modal-title').textContent = isEdit ? `${t('edit')} ${cat.name}` : t('addCategory');
  const modalBody = document.getElementById('form-modal-body');

  modalBody.innerHTML = `
    <div class="field-group">
      <label>${t('name')}</label>
      <input id="cat-name" class="input" value="${escapeAttr(cat ? cat.name : '')}" />
    </div>
    <button id="btn-save-cat" class="btn btn-primary btn-block">${t('save')}</button>
  `;

  document.getElementById('btn-save-cat').addEventListener('click', async () => {
    const payload = { name: document.getElementById('cat-name').value };
    try {
      if (isEdit) {
        await api(`/api/admin/categories/${cat.id}`, { method: 'PUT', body: payload });
      } else {
        await api('/api/admin/categories', { method: 'POST', body: payload });
      }
      toast(t('saved'), 'success');
      closeModal('form-overlay', 'form-modal');
      loadAdminData();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  openModal('form-overlay', 'form-modal');
}

async function deleteCategory(id) {
  if (!confirm(t('confirmDelete'))) return;
  try {
    await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function openTableEditor(tb = null) {
  const isEdit = !!tb;
  document.getElementById('form-modal-title').textContent = isEdit ? `${t('edit')} ${tb.name}` : t('addTable');
  const modalBody = document.getElementById('form-modal-body');

  modalBody.innerHTML = `
    <div class="field-group">
      <label>${t('name')}</label>
      <input id="tb-name" class="input" value="${escapeAttr(tb ? tb.name : '')}" />
    </div>
    <button id="btn-save-tb" class="btn btn-primary btn-block">${t('save')}</button>
  `;

  document.getElementById('btn-save-tb').addEventListener('click', async () => {
    const payload = { name: document.getElementById('tb-name').value };
    try {
      if (isEdit) {
        await api(`/api/admin/tables/${tb.id}`, { method: 'PUT', body: payload });
      } else {
        await api('/api/admin/tables', { method: 'POST', body: payload });
      }
      toast(t('saved'), 'success');
      closeModal('form-overlay', 'form-modal');
      loadAdminData();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  openModal('form-overlay', 'form-modal');
}

async function deleteTable(id) {
  if (!confirm(t('confirmDelete'))) return;
  try {
    await api(`/api/admin/tables/${id}`, { method: 'DELETE' });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function saveSettings() {
  const payload = {
    name: document.getElementById('setting-name').value,
    phone: document.getElementById('setting-phone').value,
    address: document.getElementById('setting-address').value,
    openingMessage: document.getElementById('setting-message').value,
    open: document.getElementById('setting-open').checked,
  };

  try {
    await api('/api/admin/settings', { method: 'PUT', body: payload });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ============================================================================
// Event Listeners & Entry Point
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  init();

  // Buttons & Controls
  document.getElementById('btn-confirm-table')?.addEventListener('click', confirmTableSelection);
  document.getElementById('btn-cart')?.addEventListener('click', openCart);
  document.getElementById('btn-close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('btn-confirm-order')?.addEventListener('click', confirmOrder);
  
  document.getElementById('btn-settings')?.addEventListener('click', () => openModal('settings-overlay', 'settings-modal'));
  document.getElementById('btn-close-settings')?.addEventListener('click', () => closeModal('settings-overlay', 'settings-modal'));
  
  document.getElementById('btn-open-admin')?.addEventListener('click', () => {
    closeModal('settings-overlay', 'settings-modal');
    openModal('admin-login-overlay', 'admin-login-modal');
  });
  document.getElementById('btn-close-admin-login')?.addEventListener('click', () => closeModal('admin-login-overlay', 'admin-login-modal'));
  document.getElementById('btn-submit-admin-code')?.addEventListener('click', submitAdminCode);
  
  document.getElementById('btn-exit-admin')?.addEventListener('click', () => goToCustomerHome());

  // Admin Nav buttons
  document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchAdminView(btn.dataset.view));
  });

  // Admin Actions
  document.getElementById('btn-add-product')?.addEventListener('click', () => openProductEditor());
  document.getElementById('btn-add-category')?.addEventListener('click', () => openCategoryEditor());
  document.getElementById('btn-add-table')?.addEventListener('click', () => openTableEditor());
  document.getElementById('btn-save-settings')?.addEventListener('click', saveSettings);
});
