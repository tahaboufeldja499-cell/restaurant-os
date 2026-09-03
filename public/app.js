'use strict';

/* ============================================================================
   i18n
   ========================================================================== */
const I18N = {
  en: {
    loading: 'Loading...',
    closedTitle: 'The restaurant is currently closed',
    heroTitle: 'Welcome 👋',
    heroSub: 'Choose your table and start your order',
    noTables: 'No tables available right now.',
    settings: 'Settings',
    back: 'Back',
    cart: 'Cart',
    yourCart: 'Your cart',
    cartEmpty: 'Your cart is empty',
    total: 'Total',
    confirmOrder: 'Confirm Order',
    orderSuccess: 'Your order has been sent successfully 🎉',
    newOrder: 'New order',
    language: 'Language',
    admin: 'Admin',
    adminLogin: 'Admin Login',
    adminCode: 'Admin Code',
    invalidCode: 'Invalid admin code',
    login: 'Login',
    dashboard: 'Dashboard',
    orders: 'Orders',
    products: 'Products',
    categories: 'Categories',
    tables: 'Tables',
    restaurantSettings: 'Settings',
    logout: 'Logout',
    totalOrders: 'Total Orders',
    newOrdersLabel: 'New',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    totalRevenue: 'Total Revenue',
    noOrders: 'No orders yet',
    addProduct: '+ Add product',
    addCategory: '+ Add category',
    addTable: '+ Add table',
    restaurantName: 'Restaurant Name',
    logoUrl: 'Logo',
    phone: 'Phone',
    address: 'Address',
    openingMessage: 'Opening message',
    restaurantOpen: 'Restaurant Open',
    save: 'Save',
    noProducts: 'No products in this category yet.',
    name: 'Name',
    description: 'Description',
    price: 'Price',
    category: 'Category',
    image: 'Image',
    available: 'Available',
    featured: 'Featured',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    disable: 'Disable',
    enable: 'Enable',
    confirmDelete: 'Are you sure you want to delete this?',
    table: 'Table',
    noCategory: 'Uncategorized',
    closedCannotOrder: 'The restaurant is closed. Ordering is not available right now.',
    orderFailed: 'Could not send your order. Please try again.',
    loginFailed: 'Login failed. Please try again.',
    saved: 'Saved successfully',
    added: 'Added to cart',
    chooseImage: 'Choose image',
    uploading: 'Uploading...',
    uploaded: 'Image uploaded',
    uploadFailed: 'Image upload failed',
    confirmTable: 'Confirm',
    tableOccupied: 'Occupied',
    tableEmpty: 'Empty',
    markEmpty: 'Mark empty',
    markOccupied: 'Mark occupied',
    delivered: 'Delivered',
    orderArrivedTitle: 'Your order has arrived!',
    orderArrivedSub: 'Order #{id} is at your table',
    confirmReceipt: 'Confirm receipt',
    receiptConfirmed: 'Thanks! Order closed',
  },
  fr: {
    loading: 'Chargement...',
    closedTitle: "Le restaurant est actuellement fermé",
    heroTitle: 'Bienvenue 👋',
    heroSub: 'Choisissez votre table et commencez votre commande',
    noTables: 'Aucune table disponible pour le moment.',
    settings: 'Paramètres',
    back: 'Retour',
    cart: 'Panier',
    yourCart: 'Votre panier',
    cartEmpty: 'Votre panier est vide',
    total: 'Total',
    confirmOrder: 'Confirmer la commande',
    orderSuccess: 'Votre commande a été envoyée avec succès 🎉',
    newOrder: 'Nouvelle commande',
    language: 'Langue',
    admin: 'Admin',
    adminLogin: 'Connexion Admin',
    adminCode: 'Code Admin',
    invalidCode: 'Code admin invalide',
    login: 'Connexion',
    dashboard: 'Tableau de bord',
    orders: 'Commandes',
    products: 'Produits',
    categories: 'Catégories',
    tables: 'Tables',
    restaurantSettings: 'Paramètres',
    logout: 'Déconnexion',
    totalOrders: 'Total des commandes',
    newOrdersLabel: 'Nouvelles',
    preparing: 'En préparation',
    ready: 'Prêtes',
    completed: 'Terminées',
    totalRevenue: 'Revenu total',
    noOrders: 'Aucune commande pour le moment',
    addProduct: '+ Ajouter un produit',
    addCategory: '+ Ajouter une catégorie',
    addTable: '+ Ajouter une table',
    restaurantName: 'Nom du restaurant',
    logoUrl: 'Logo',
    phone: 'Téléphone',
    address: 'Adresse',
    openingMessage: "Message d'accueil",
    restaurantOpen: 'Restaurant ouvert',
    save: 'Enregistrer',
    noProducts: 'Aucun produit dans cette catégorie.',
    name: 'Nom',
    description: 'Description',
    price: 'Prix',
    category: 'Catégorie',
    image: 'Image',
    available: 'Disponible',
    featured: 'Mis en avant',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    disable: 'Désactiver',
    enable: 'Activer',
    confirmDelete: 'Voulez-vous vraiment supprimer cet élément ?',
    table: 'Table',
    noCategory: 'Sans catégorie',
    closedCannotOrder: "Le restaurant est fermé. Les commandes ne sont pas disponibles.",
    orderFailed: "Impossible d'envoyer votre commande. Veuillez réessayer.",
    loginFailed: 'Échec de la connexion. Veuillez réessayer.',
    saved: 'Enregistré avec succès',
    added: 'Ajouté au panier',
    chooseImage: 'Choisir une image',
    uploading: 'Téléversement...',
    uploaded: 'Image téléversée',
    uploadFailed: "Échec du téléversement de l'image",
    confirmTable: 'Confirmer',
    tableOccupied: 'Occupée',
    tableEmpty: 'Libre',
    markEmpty: 'Marquer libre',
    markOccupied: 'Marquer occupée',
    delivered: 'Livrée',
    orderArrivedTitle: 'Votre commande est arrivée !',
    orderArrivedSub: 'La commande #{id} est à votre table',
    confirmReceipt: 'Confirmer la réception',
    receiptConfirmed: 'Merci ! Commande clôturée',
  },
  ar: {
    loading: 'جاري التحميل...',
    closedTitle: 'المطعم مغلق حاليًا',
    heroTitle: 'مرحبًا بك 👋',
    heroSub: 'اختر طاولتك وابدأ طلبك',
    noTables: 'لا توجد طاولات متاحة حاليًا.',
    settings: 'الإعدادات',
    back: 'رجوع',
    cart: 'السلة',
    yourCart: 'سلتك',
    cartEmpty: 'السلة فارغة',
    total: 'المجموع',
    confirmOrder: 'تأكيد الطلب',
    orderSuccess: 'تم إرسال طلبك بنجاح 🎉',
    newOrder: 'طلب جديد',
    language: 'اللغة',
    admin: 'الإدارة',
    adminLogin: 'دخول الإدارة',
    adminCode: 'رمز الإدارة',
    invalidCode: 'رمز الإدارة غير صحيح',
    login: 'دخول',
    dashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    products: 'المنتجات',
    categories: 'التصنيفات',
    tables: 'الطاولات',
    restaurantSettings: 'إعدادات المطعم',
    logout: 'تسجيل الخروج',
    totalOrders: 'إجمالي الطلبات',
    newOrdersLabel: 'جديدة',
    preparing: 'قيد التحضير',
    ready: 'جاهزة',
    completed: 'مكتملة',
    totalRevenue: 'إجمالي الإيرادات',
    noOrders: 'لا توجد طلبات حتى الآن',
    addProduct: '+ إضافة منتج',
    addCategory: '+ إضافة تصنيف',
    addTable: '+ إضافة طاولة',
    restaurantName: 'اسم المطعم',
    logoUrl: 'الشعار',
    phone: 'الهاتف',
    address: 'العنوان',
    openingMessage: 'رسالة الترحيب',
    restaurantOpen: 'المطعم مفتوح',
    save: 'حفظ',
    noProducts: 'لا توجد منتجات في هذا التصنيف حتى الآن.',
    name: 'الاسم',
    description: 'الوصف',
    price: 'السعر',
    category: 'التصنيف',
    image: 'الصورة',
    available: 'متاح',
    featured: 'مميز',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    disable: 'تعطيل',
    enable: 'تفعيل',
    confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
    table: 'طاولة',
    noCategory: 'بدون تصنيف',
    closedCannotOrder: 'المطعم مغلق حاليًا. لا يمكن إرسال الطلبات الآن.',
    orderFailed: 'تعذر إرسال طلبك. الرجاء المحاولة مرة أخرى.',
    loginFailed: 'فشل تسجيل الدخول. حاول مرة أخرى.',
    saved: 'تم الحفظ بنجاح',
    added: 'تمت الإضافة إلى السلة',
    chooseImage: 'اختر صورة',
    uploading: 'جاري الرفع...',
    uploaded: 'تم رفع الصورة',
    uploadFailed: 'فشل رفع الصورة',
    confirmTable: 'تأكيد',
    tableOccupied: 'مشغولة',
    tableEmpty: 'فارغة',
    markEmpty: 'تعيين كفارغة',
    markOccupied: 'تعيين كمشغولة',
    delivered: 'تم التوصيل',
    orderArrivedTitle: 'وصل طلبك! 🍽️',
    orderArrivedSub: 'الطلب #{id} وصل إلى طاولتك',
    confirmReceipt: 'تأكيد الاستلام',
    receiptConfirmed: 'شكرًا! تم إغلاق الطلب',
  },
};

let currentLang = localStorage.getItem('ros_lang') || 'ar';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyLanguage(lang) {
  currentLang = I18N[lang] ? lang : 'en';
  localStorage.setItem('ros_lang', currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  if (state.publicData) {
    renderTables();
    renderMenu();
    renderCart();
  }
}

/* ============================================================================
   State
   ========================================================================== */
const state = {
  publicData: null,
  selectedTable: null,
  pendingTable: null,
  activeCategory: 'all',
  cart: [], // { productId, name, price, image, qty }
  adminData: null,
  adminOrders: null,
  currency: 'DA',
};

/* ============================================================================
   API helpers
   ========================================================================== */
async function api(path, options = {}) {
  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'same-origin',
  });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const error = new Error((data && data.error) || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

/* ============================================================================
   Toasts
   ========================================================================== */
function toast(message, type = 'info') {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 220);
  }, 2600);
}

/* ============================================================================
   Screen navigation
   ========================================================================== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ============================================================================
   Table lock (QR code / one-time manual selection)
   ========================================================================== */
const TABLE_STORAGE_KEY = 'ros_table';

function getLockedTable() {
  try {
    const raw = localStorage.getItem(TABLE_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.locked && Number.isInteger(data.id)) return data;
  } catch { /* ignore malformed storage */ }
  return null;
}

function persistLockedTable(table) {
  localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify({ id: table.id, name: table.name, locked: true }));
}

function updateTablePill(table) {
  document.getElementById('menu-table-pill').textContent = `${t('table')} ${table.name.replace(/[^0-9]/g, '') || table.name}`;
}

/* Locks the customer into this table for the rest of the browser session:
   persists it to localStorage (survives reloads and Render free-tier
   spin-downs) and permanently hides the "change table" affordance. */
function lockTableSelection(table) {
  state.selectedTable = table;
  state.pendingTable = null;
  persistLockedTable(table);
  document.getElementById('btn-back-tables').classList.add('hidden');
  hideTableConfirmBar();
  updateTablePill(table);
  renderMenu();
  showScreen('screen-menu');
}

/* Returns the customer to wherever they belong: their locked table's menu
   if they have one, or the one-time table picker if they don't (used by
   "new order" and when leaving admin mode — never wipes an existing lock). */
function goToCustomerHome() {
  if (state.selectedTable) {
    renderMenu();
    showScreen('screen-menu');
  } else {
    renderTables();
    showScreen('screen-tables');
  }
}

/* ============================================================================
   Init
   ========================================================================== */
async function init() {
  try {
    const data = await api('/api/public');
    state.publicData = data;

    if (!data.restaurant.open) {
      document.getElementById('brand-name').textContent = data.restaurant.name;
      document.getElementById('closed-message').textContent =
        data.restaurant.openingMessage || '';
      showScreen('screen-closed');
      applyLanguage(currentLang);
      return;
    }

    document.getElementById('brand-name').textContent = data.restaurant.name;
    document.getElementById('menu-brand-name').textContent = data.restaurant.name;
    if (data.restaurant.logo) {
      const logo = document.getElementById('brand-logo');
      logo.src = data.restaurant.logo;
      logo.classList.remove('hidden');
    }

    // 1) QR code entry — ?table=<id> — always wins and (re)locks the table.
    const params = new URLSearchParams(window.location.search);
    const qrTableId = Number(params.get('table'));
    let resolvedTable = null;

    if (Number.isInteger(qrTableId) && qrTableId > 0) {
      const match = data.tables.find((tb) => tb.id === qrTableId);
      if (match) {
        resolvedTable = match;
        // Clean the URL so a refresh relies on localStorage, not the query string.
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    // 2) Otherwise, resume a previously locked table (manual pick or earlier QR scan).
    if (!resolvedTable) {
      const locked = getLockedTable();
      if (locked) {
        const match = data.tables.find((tb) => tb.id === locked.id);
        resolvedTable = match || { id: locked.id, name: locked.name };
      }
    }

    if (resolvedTable) {
      lockTableSelection(resolvedTable);
    } else {
      // 3) First visit, no QR — one-time manual selection screen.
      renderTables();
      showScreen('screen-tables');
    }

    applyLanguage(currentLang);
    startOrderPolling();
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ============================================================================
   Tables
   ========================================================================== */
function renderTables() {
  const grid = document.getElementById('tables-grid');
  const empty = document.getElementById('tables-empty');
  const tables = (state.publicData && state.publicData.tables) || [];
  grid.innerHTML = '';
  empty.classList.toggle('hidden', tables.length > 0);
  state.pendingTable = null;
  hideTableConfirmBar();

  tables.forEach((table, idx) => {
    const card = document.createElement('div');
    card.className = 'table-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    card.innerHTML = `<span class="table-icon">🍽️</span><span class="table-name">${escapeHtml(table.name)}</span>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.table-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      state.pendingTable = table;
      showTableConfirmBar(table);
    });
    grid.appendChild(card);
  });
}

function showTableConfirmBar(table) {
  document.getElementById('table-confirm-text').textContent =
    `${t('table')} ${table.name.replace(/[^0-9]/g, '') || table.name}`;
  document.getElementById('table-confirm-bar').classList.remove('hidden');
}
function hideTableConfirmBar() {
  document.getElementById('table-confirm-bar').classList.add('hidden');
}
function confirmTableSelection() {
  if (!state.pendingTable) return;
  lockTableSelection(state.pendingTable);
}

/* ============================================================================
   Menu (categories + products)
   ========================================================================== */
function renderMenu() {
  if (!state.publicData) return;
  const { categories, products } = state.publicData;

  const tabsEl = document.getElementById('category-tabs');
  tabsEl.innerHTML = '';
  const allTab = document.createElement('button');
  allTab.className = `category-tab ${state.activeCategory === 'all' ? 'active' : ''}`;
  allTab.textContent = t('categories') === 'Categories' ? 'All' : (currentLang === 'ar' ? 'الكل' : 'Tous');
  allTab.addEventListener('click', () => { state.activeCategory = 'all'; renderMenu(); });
  tabsEl.appendChild(allTab);

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = `category-tab ${state.activeCategory === cat.id ? 'active' : ''}`;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => { state.activeCategory = cat.id; renderMenu(); });
    tabsEl.appendChild(btn);
  });

  const grid = document.getElementById('products-grid');
  const empty = document.getElementById('products-empty');
  grid.innerHTML = '';

  const filtered = products.filter((p) =>
    state.activeCategory === 'all' ? true : p.category_id === state.activeCategory
  );
  empty.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    card.innerHTML = `
      <div class="product-image-wrap">
        ${p.featured ? `<span class="featured-badge">⭐ ${t('featured')}</span>` : ''}
        <img class="product-image" loading="lazy" src="${escapeAttr(p.image || placeholderImg())}" alt="${escapeAttr(p.name)}" onerror="this.src='${placeholderImg()}'">
      </div>
      <div class="product-body">
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-desc">${escapeHtml(p.description || '')}</div>
        <div class="product-foot">
          <span class="product-price">${formatPrice(p.price)}</span>
        </div>
        <button class="btn-add">+ ${currentLang === 'ar' ? 'إضافة' : (currentLang === 'fr' ? 'Ajouter' : 'Add')}</button>
      </div>
    `;
    card.querySelector('.btn-add').addEventListener('click', () => addToCart(p));
    grid.appendChild(card);
  });
}

/* ---------- image upload helper ----------
   Wires a "choose image" file input + preview to the upload endpoint.
   Calls onUploaded(url) once the upload succeeds; the caller decides
   where that URL gets stored. */
function wireImageUpload({ fileInputId, previewId, statusId, onUploaded }) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewId);
  const statusEl = document.getElementById(statusId);
  if (!fileInput) return;
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (preview) preview.src = objectUrl;
    if (statusEl) { statusEl.textContent = t('uploading'); statusEl.classList.remove('ok'); }
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
      let data = null;
      try { data = await res.json(); } catch { data = null; }
      if (!res.ok) throw new Error((data && data.error) || t('uploadFailed'));
      onUploaded(data.url);
      if (statusEl) { statusEl.textContent = t('uploaded'); statusEl.classList.add('ok'); }
    } catch (err) {
      if (statusEl) statusEl.textContent = '';
      toast(err.message || t('uploadFailed'), 'error');
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  });
}

function placeholderImg() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#1a1d29"/></svg>`
  );
}

function formatPrice(n) {
  return `${Number(n).toLocaleString()} ${state.currency}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str == null ? '' : str);
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str == null ? '' : str).replace(/"/g, '&quot;');
}

/* ============================================================================
   Cart
   ========================================================================== */
function addToCart(product) {
  const existing = state.cart.find((it) => it.productId === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ productId: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }
  renderCart();
  toast(t('added'), 'success');
}

function changeQty(productId, delta) {
  const item = state.cart.find((it) => it.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((it) => it.productId !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((it) => it.productId !== productId);
  renderCart();
}

function cartTotal() {
  return state.cart.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const countEl = document.getElementById('cart-count');
  const totalCount = state.cart.reduce((s, it) => s + it.qty, 0);

  countEl.textContent = totalCount;
  countEl.classList.toggle('hidden', totalCount === 0);

  list.innerHTML = '';
  empty.classList.toggle('hidden', state.cart.length > 0);

  state.cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img class="cart-item-img" src="${escapeAttr(item.image || placeholderImg())}" onerror="this.src='${placeholderImg()}'">
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" data-action="dec">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" data-action="inc">+</button>
      </div>
    `;
    row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.productId, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.productId, 1));
    list.appendChild(row);
  });

  document.getElementById('cart-total').textContent = formatPrice(cartTotal());
}

function openCart() {
  document.getElementById('cart-overlay').classList.remove('hidden');
  document.getElementById('cart-drawer').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-overlay').classList.add('hidden');
  document.getElementById('cart-drawer').classList.remove('open');
}

async function confirmOrder() {
  if (state.cart.length === 0) return;
  if (!state.selectedTable) return;

  const btn = document.getElementById('btn-confirm-order');
  btn.disabled = true;
  try {
    const payload = {
      tableId: state.selectedTable.id,
      items: state.cart.map((it) => ({ productId: it.productId, qty: it.qty })),
    };
    const result = await api('/api/orders', { method: 'POST', body: payload });
    document.getElementById('order-number').textContent = `Order #${result.orderId}`;
    state.cart = [];
    renderCart();
    closeCart();
    showScreen('screen-success');
    addTrackedOrder(result.orderId);
    startOrderPolling();
  } catch (err) {
    toast(err.message === 'Restaurant is currently closed' ? t('closedCannotOrder') : (err.message || t('orderFailed')), 'error');
  } finally {
    btn.disabled = false;
  }
}

/* ============================================================================
   Order tracking + delivery notifications (polling)
   Survives page reloads / Render free-tier spin-downs via localStorage —
   we only ever store order ids here, never sensitive data.
   ========================================================================== */
const TRACKED_ORDERS_KEY = 'ros_active_orders';
const POLL_INTERVAL_MS = 5000;
let pollTimer = null;

function getTrackedOrders() {
  try {
    const arr = JSON.parse(localStorage.getItem(TRACKED_ORDERS_KEY) || '[]');
    return Array.isArray(arr) ? arr.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}
function setTrackedOrders(arr) {
  localStorage.setItem(TRACKED_ORDERS_KEY, JSON.stringify(arr));
}
function addTrackedOrder(id) {
  const arr = getTrackedOrders();
  if (!arr.includes(id)) {
    arr.push(id);
    setTrackedOrders(arr);
  }
}
function removeTrackedOrder(id) {
  setTrackedOrders(getTrackedOrders().filter((x) => x !== id));
  const el = document.getElementById(`delivery-notify-${id}`);
  if (el) el.remove();
}

function startOrderPolling() {
  if (pollTimer) return;
  pollTrackedOrders();
  pollTimer = setInterval(pollTrackedOrders, POLL_INTERVAL_MS);
}

async function pollTrackedOrders() {
  const ids = getTrackedOrders();
  if (ids.length === 0) return;
  try {
    const data = await api(`/api/orders/status?ids=${ids.join(',')}`);
    const returnedIds = new Set();
    const stillActive = [];
    (data.orders || []).forEach((o) => {
      returnedIds.add(o.id);
      if (o.status === 'DELIVERED') {
        showDeliveryNotification(o);
        stillActive.push(o.id);
      } else if (o.status === 'COMPLETED' || o.status === 'CANCELLED') {
        removeTrackedOrder(o.id);
      } else {
        stillActive.push(o.id);
      }
    });
    // Orders the server no longer knows about (deleted) shouldn't be tracked forever.
    ids.forEach((id) => {
      if (!returnedIds.has(id)) removeTrackedOrder(id);
    });
    setTrackedOrders(stillActive);
  } catch {
    // Network hiccup or a spinning-down free-tier server — just retry on the next tick.
  }
}

function showDeliveryNotification(order) {
  if (document.getElementById(`delivery-notify-${order.id}`)) return; // already showing
  const root = document.getElementById('delivery-notify-root');
  const card = document.createElement('div');
  card.className = 'delivery-notify-card';
  card.id = `delivery-notify-${order.id}`;
  card.innerHTML = `
    <div class="delivery-notify-icon">🍽️</div>
    <div class="delivery-notify-text">
      <strong>${escapeHtml(t('orderArrivedTitle'))}</strong>
      <span>${escapeHtml(t('orderArrivedSub').replace('{id}', order.id))}</span>
    </div>
    <button class="btn btn-sm" data-confirm-id="${order.id}">${escapeHtml(t('confirmReceipt'))}</button>
  `;
  card.querySelector('[data-confirm-id]').addEventListener('click', async (e) => {
    e.target.disabled = true;
    try {
      await api(`/api/orders/${order.id}/confirm`, { method: 'POST' });
      removeTrackedOrder(order.id);
      toast(t('receiptConfirmed'), 'success');
    } catch (err) {
      e.target.disabled = false;
      toast(err.message, 'error');
    }
  });
  root.appendChild(card);
}

/* ============================================================================
   Settings modal / admin login
   ========================================================================== */
function openModal(overlayId, modalId) {
  document.getElementById(overlayId).classList.remove('hidden');
  document.getElementById(modalId).classList.add('open');
}
function closeModal(overlayId, modalId) {
  document.getElementById(overlayId).classList.add('hidden');
  document.getElementById(modalId).classList.remove('open');
}

async function submitAdminCode() {
  const input = document.getElementById('admin-code-input');
  const errorEl = document.getElementById('admin-login-error');
  errorEl.classList.add('hidden');
  try {
    await api('/api/admin/login', { method: 'POST', body: { code: input.value } });
    input.value = '';
    closeModal('admin-login-overlay', 'admin-login-modal');
    await enterAdmin();
  } catch (err) {
    errorEl.textContent = t('invalidCode');
    errorEl.classList.remove('hidden');
  }
}

/* ============================================================================
   Admin dashboard
   ========================================================================== */
async function enterAdmin() {
  closeCart();
  showScreen('screen-admin');
  switchAdminView('dashboard');
  await Promise.all([loadStats(), loadAdminData()]);
}

function switchAdminView(view) {
  document.querySelectorAll('.admin-nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.admin-view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`admin-view-${view}`).classList.add('active');
  document.getElementById('admin-view-title').textContent = t(
    { dashboard: 'dashboard', orders: 'orders', products: 'products', categories: 'categories', tables: 'tables', settings: 'restaurantSettings' }[view]
  );
  if (view === 'orders') loadOrders();
}

async function loadStats() {
  try {
    const stats = await api('/api/admin/stats');
    document.getElementById('stat-total').textContent = stats.totalOrders;
    document.getElementById('stat-new').textContent = stats.newOrders;
    document.getElementById('stat-preparing').textContent = stats.preparing;
    document.getElementById('stat-ready').textContent = stats.ready;
    document.getElementById('stat-delivered').textContent = stats.delivered;
    document.getElementById('stat-completed').textContent = stats.completed;
    document.getElementById('stat-revenue').textContent = formatPrice(stats.totalRevenue);
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function loadOrders() {
  try {
    const orders = await api('/api/admin/orders');
    state.adminOrders = orders;
    renderOrders();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function renderOrders() {
  const list = document.getElementById('orders-list');
  const empty = document.getElementById('orders-empty');
  const orders = state.adminOrders || [];
  list.innerHTML = '';
  empty.classList.toggle('hidden', orders.length > 0);

  const statuses = ['NEW', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

  orders.forEach((order, idx) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.style.animationDelay = `${idx * 0.04}s`;
    const itemsLine = order.items.map((it) => `${escapeHtml(it.name)} x${it.qty}`).join(', ');
    card.innerHTML = `
      <div class="order-card-head">
        <span class="order-id">#${order.id}</span>
        <span class="status-badge status-${order.status}">${order.status}</span>
      </div>
      <div class="order-table">${escapeHtml(order.table_name)} · ${new Date(order.created_at).toLocaleString()}</div>
      <div class="order-items-line">${itemsLine}</div>
      <div class="order-card-foot">
        <span class="order-total">${formatPrice(order.total)}</span>
        <select class="status-select" data-id="${order.id}">
          ${statuses.map((s) => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    `;
    card.querySelector('.status-select').addEventListener('change', async (e) => {
      try {
        await api(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status: e.target.value } });
        toast(t('saved'), 'success');
        loadStats();
        loadOrders();
      } catch (err) {
        toast(err.message, 'error');
      }
    });
    list.appendChild(card);
  });
}

async function loadAdminData() {
  try {
    const data = await api('/api/admin/data');
    state.adminData = data;
    renderAdminProducts();
    renderAdminCategories();
    renderAdminTables();
    fillSettingsForm();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function categoryName(id) {
  const cat = (state.adminData.categories || []).find((c) => c.id === id);
  return cat ? cat.name : t('noCategory');
}

function renderAdminProducts() {
  const list = document.getElementById('admin-products-list');
  list.innerHTML = '';
  (state.adminData.products || []).forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'admin-item-card';
    row.style.animationDelay = `${idx * 0.04}s`;
    row.innerHTML = `
      <img class="admin-item-img" src="${escapeAttr(p.image || placeholderImg())}" onerror="this.src='${placeholderImg()}'">
      <div class="admin-item-info">
        <div class="admin-item-title">
          ${escapeHtml(p.name)}
          ${!p.available ? `<span class="badge-off">${t('disable')}</span>` : ''}
          ${p.featured ? `<span class="badge-featured">${t('featured')}</span>` : ''}
        </div>
        <div class="admin-item-sub">${escapeHtml(categoryName(p.category_id))} · ${formatPrice(p.price)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;
    row.querySelector('[data-action="edit"]').addEventListener('click', () => openProductForm(p));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProduct(p.id));
    list.appendChild(row);
  });
}

function renderAdminCategories() {
  const list = document.getElementById('admin-categories-list');
  list.innerHTML = '';
  (state.adminData.categories || []).forEach((c, idx) => {
    const row = document.createElement('div');
    row.className = 'admin-item-card';
    row.style.animationDelay = `${idx * 0.04}s`;
    row.innerHTML = `
      <div class="admin-item-info">
        <div class="admin-item-title">${escapeHtml(c.name)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;
    row.querySelector('[data-action="edit"]').addEventListener('click', () => openCategoryForm(c));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteCategory(c.id));
    list.appendChild(row);
  });
}

function renderAdminTables() {
  const list = document.getElementById('admin-tables-list');
  list.innerHTML = '';
  (state.adminData.tables || []).forEach((tbl, idx) => {
    const row = document.createElement('div');
    row.className = 'admin-item-card';
    row.style.animationDelay = `${idx * 0.04}s`;
    const occupied = tbl.status === 'occupied';
    row.innerHTML = `
      <div class="admin-item-info">
        <div class="admin-item-title">
          ${escapeHtml(tbl.name)}
          ${!tbl.active ? `<span class="badge-off">${t('disable')}</span>` : ''}
          <span class="badge-status ${occupied ? 'occupied' : 'empty'}">${occupied ? t('tableOccupied') : t('tableEmpty')}</span>
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-ghost btn-sm" data-action="toggle-status">${occupied ? t('markEmpty') : t('markOccupied')}</button>
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-ghost btn-sm" data-action="toggle">${tbl.active ? t('disable') : t('enable')}</button>
      </div>
    `;
    row.querySelector('[data-action="edit"]').addEventListener('click', () => openTableForm(tbl));
    row.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleTable(tbl));
    row.querySelector('[data-action="toggle-status"]').addEventListener('click', () => toggleTableStatus(tbl));
    list.appendChild(row);
  });
}

async function toggleTableStatus(table) {
  try {
    const newStatus = table.status === 'occupied' ? 'empty' : 'occupied';
    await api(`/api/admin/tables/${table.id}`, { method: 'PATCH', body: { status: newStatus } });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

function fillSettingsForm() {
  const s = state.adminData.settings || {};
  document.getElementById('setting-name').value = s.restaurant_name || '';
  document.getElementById('setting-logo').value = s.logo || '';
  document.getElementById('setting-logo-preview').src = s.logo || placeholderImg();
  document.getElementById('setting-phone').value = s.phone || '';
  document.getElementById('setting-address').value = s.address || '';
  document.getElementById('setting-message').value = s.opening_message || '';
  document.getElementById('setting-open').checked = s.open !== '0';
}

async function saveSettings() {
  try {
    await api('/api/admin/settings', {
      method: 'PUT',
      body: {
        restaurant_name: document.getElementById('setting-name').value,
        logo: document.getElementById('setting-logo').value,
        phone: document.getElementById('setting-phone').value,
        address: document.getElementById('setting-address').value,
        opening_message: document.getElementById('setting-message').value,
        open: document.getElementById('setting-open').checked,
      },
    });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ---------- generic form modal ---------- */
function openFormModal(title, bodyHtml, onSubmit) {
  document.getElementById('form-modal-title').textContent = title;
  document.getElementById('form-modal-body').innerHTML = bodyHtml;
  openModal('form-overlay', 'form-modal');
  const submitBtn = document.getElementById('form-modal-body').querySelector('[data-submit]');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      try {
        await onSubmit();
        closeModal('form-overlay', 'form-modal');
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
}

function openProductForm(product) {
  const isEdit = !!product;
  const categories = state.adminData.categories || [];
  const options = categories.map((c) =>
    `<option value="${c.id}" ${product && product.category_id === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
  ).join('');

  let currentImage = product ? (product.image || '') : '';

  const html = `
    <div class="field-group"><label>${t('name')}</label><input id="f-name" class="input" value="${escapeAttr(product ? product.name : '')}"></div>
    <div class="field-group"><label>${t('description')}</label><textarea id="f-desc" class="input">${escapeHtml(product ? product.description : '')}</textarea></div>
    <div class="field-group"><label>${t('price')}</label><input id="f-price" type="number" min="0" step="0.01" class="input" value="${product ? product.price : ''}"></div>
    <div class="field-group"><label>${t('category')}</label><select id="f-cat" class="input"><option value="">${t('noCategory')}</option>${options}</select></div>
    <div class="field-group">
      <label>${t('image')}</label>
      <div class="image-upload-row">
        <img id="f-image-preview" class="image-preview" src="${escapeAttr(currentImage || placeholderImg())}" onerror="this.src='${placeholderImg()}'">
        <div class="image-upload-actions">
          <label for="f-image-file" class="btn btn-ghost btn-sm">${t('chooseImage')}</label>
          <input id="f-image-file" type="file" accept="image/*" class="hidden">
          <span id="f-image-status" class="image-upload-status"></span>
        </div>
      </div>
    </div>
    <div class="field-group toggle-row"><label>${t('available')}</label><label class="switch"><input id="f-available" type="checkbox" ${!product || product.available ? 'checked' : ''}><span class="slider"></span></label></div>
    <div class="field-group toggle-row"><label>${t('featured')}</label><label class="switch"><input id="f-featured" type="checkbox" ${product && product.featured ? 'checked' : ''}><span class="slider"></span></label></div>
    <button class="btn btn-primary btn-block" data-submit>${t('save')}</button>
  `;

  openFormModal(isEdit ? t('edit') : t('addProduct'), html, async () => {
    const payload = {
      name: document.getElementById('f-name').value.trim(),
      description: document.getElementById('f-desc').value.trim(),
      price: Number(document.getElementById('f-price').value),
      category_id: document.getElementById('f-cat').value ? Number(document.getElementById('f-cat').value) : null,
      image: currentImage,
      available: document.getElementById('f-available').checked,
      featured: document.getElementById('f-featured').checked,
    };
    if (isEdit) {
      await api(`/api/admin/products/${product.id}`, { method: 'PUT', body: payload });
    } else {
      await api('/api/admin/products', { method: 'POST', body: payload });
    }
    toast(t('saved'), 'success');
    loadAdminData();
  });

  wireImageUpload({
    fileInputId: 'f-image-file',
    previewId: 'f-image-preview',
    statusId: 'f-image-status',
    onUploaded: (url) => { currentImage = url; },
  });
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

function openCategoryForm(category) {
  const isEdit = !!category;
  const html = `
    <div class="field-group"><label>${t('name')}</label><input id="f-cat-name" class="input" value="${escapeAttr(category ? category.name : '')}"></div>
    <button class="btn btn-primary btn-block" data-submit>${t('save')}</button>
  `;
  openFormModal(isEdit ? t('edit') : t('addCategory'), html, async () => {
    const name = document.getElementById('f-cat-name').value.trim();
    if (isEdit) {
      await api(`/api/admin/categories/${category.id}`, { method: 'PUT', body: { name } });
    } else {
      await api('/api/admin/categories', { method: 'POST', body: { name } });
    }
    toast(t('saved'), 'success');
    loadAdminData();
  });
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

function openTableForm(table) {
  const isEdit = !!table;
  const html = `
    <div class="field-group"><label>${t('name')}</label><input id="f-table-name" class="input" value="${escapeAttr(table ? table.name : '')}"></div>
    <button class="btn btn-primary btn-block" data-submit>${t('save')}</button>
  `;
  openFormModal(isEdit ? t('edit') : t('addTable'), html, async () => {
    const name = document.getElementById('f-table-name').value.trim();
    if (isEdit) {
      await api(`/api/admin/tables/${table.id}`, { method: 'PATCH', body: { name } });
    } else {
      await api('/api/admin/tables', { method: 'POST', body: { name } });
    }
    toast(t('saved'), 'success');
    loadAdminData();
  });
}

async function toggleTable(table) {
  try {
    await api(`/api/admin/tables/${table.id}`, { method: 'PATCH', body: { active: !table.active } });
    toast(t('saved'), 'success');
    loadAdminData();
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ============================================================================
   Event wiring
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.getElementById('btn-settings').addEventListener('click', () => openModal('settings-overlay', 'settings-modal'));
  document.getElementById('btn-menu-settings').addEventListener('click', () => openModal('settings-overlay', 'settings-modal'));
  document.getElementById('btn-close-settings').addEventListener('click', () => closeModal('settings-overlay', 'settings-modal'));
  document.getElementById('settings-overlay').addEventListener('click', () => closeModal('settings-overlay', 'settings-modal'));

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  document.getElementById('btn-open-admin').addEventListener('click', async () => {
    closeModal('settings-overlay', 'settings-modal');
    try {
      const me = await api('/api/admin/me');
      if (me.authenticated) {
        await enterAdmin();
      } else {
        openModal('admin-login-overlay', 'admin-login-modal');
      }
    } catch {
      openModal('admin-login-overlay', 'admin-login-modal');
    }
  });
  document.getElementById('btn-close-admin-login').addEventListener('click', () => closeModal('admin-login-overlay', 'admin-login-modal'));
  document.getElementById('admin-login-overlay').addEventListener('click', () => closeModal('admin-login-overlay', 'admin-login-modal'));
  document.getElementById('btn-submit-admin-code').addEventListener('click', submitAdminCode);
  document.getElementById('admin-code-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAdminCode();
  });

  document.getElementById('btn-back-tables').addEventListener('click', () => {
    // Table changes are locked once set (QR scan or one-time manual pick),
    // so this button stays hidden — this listener is a harmless no-op safeguard.
    goToCustomerHome();
  });

  document.getElementById('btn-cart').addEventListener('click', openCart);
  document.getElementById('btn-close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('btn-confirm-order').addEventListener('click', confirmOrder);

  document.getElementById('btn-confirm-table').addEventListener('click', confirmTableSelection);

  document.getElementById('btn-new-order').addEventListener('click', () => {
    goToCustomerHome();
  });

  document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchAdminView(btn.dataset.view));
  });
  document.getElementById('btn-exit-admin').addEventListener('click', () => {
    goToCustomerHome();
  });
  document.getElementById('btn-admin-logout').addEventListener('click', async () => {
    try { await api('/api/admin/logout', { method: 'POST' }); } catch {}
    goToCustomerHome();
  });

  wireImageUpload({
    fileInputId: 'setting-logo-file',
    previewId: 'setting-logo-preview',
    statusId: 'setting-logo-status',
    onUploaded: (url) => { document.getElementById('setting-logo').value = url; },
  });

  document.getElementById('btn-add-product').addEventListener('click', () => openProductForm(null));
  document.getElementById('btn-add-category').addEventListener('click', () => openCategoryForm(null));
  document.getElementById('btn-add-table').addEventListener('click', () => openTableForm(null));
  document.getElementById('btn-save-settings').addEventListener('click', saveSettings);

  document.getElementById('btn-close-form').addEventListener('click', () => closeModal('form-overlay', 'form-modal'));
  document.getElementById('form-overlay').addEventListener('click', () => closeModal('form-overlay', 'form-modal'));
});
