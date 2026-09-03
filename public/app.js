await api(`/api/admin/orders/${order.id}/status`, {
          method: 'PATCH',
          body: { status: e.target.value }
        });
        toast(t('saved'), 'success');
        loadOrders();
        loadStats();
      } catch (err) {
        toast(err.message, 'error');
      }
    });
    list.appendChild(card);
  });
}

/* ============================================================================
   Admin data loaders (Products, Categories, Tables, Settings)
   ========================================================================== */
async function loadAdminData() {
  try {
    const data = await api('/api/admin/data');
    state.adminData = data;
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
  if (!list || !state.adminData) return;
  list.innerHTML = '';

  state.adminData.tables.forEach((tb) => {
    const card = document.createElement('div');
    card.className = 'admin-card glass';
    card.innerHTML = `
      <div class="admin-card-body">
        <strong>${escapeHtml(tb.name)}</strong>
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-primary btn-sm" data-action="qr">📱 رمز QR</button>
        <button class="btn btn-ghost btn-sm" data-action="edit">${t('edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete">${t('delete')}</button>
      </div>
    `;
    card.querySelector('[data-action="qr"]').addEventListener('click', () => showTableQR(tb.id, tb.name));
    card.querySelector('[data-action="edit"]').addEventListener('click', () => openTableEditor(tb));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTable(tb.id));
    list.appendChild(card);
  });
}

function populateAdminSettings() {
  if (!state.adminData || !state.adminData.restaurant) return;
  const res = state.adminData.restaurant;
  document.getElementById('setting-name').value = res.name || '';
  document.getElementById('setting-phone').value = res.phone || '';
  document.getElementById('setting-address').value = res.address || '';
  document.getElementById('setting-message').value = res.openingMessage || '';
  document.getElementById('setting-open').checked = !!res.open;
  
  const preview = document.getElementById('setting-logo-preview');
  if (preview) preview.src = res.logo || placeholderImg();
  document.getElementById('setting-logo').value = res.logo || '';
}

/* ============================================================================
   Product, Category, Table Editors & Actions
   ========================================================================== */
function openProductEditor(product = null) {
  const isEdit = !!product;
  const modalTitle = document.getElementById('form-modal-title');
  const modalBody = document.getElementById('form-modal-body');
  modalTitle.textContent = isEdit ? `${t('edit')} ${product.name}` : t('addProduct');

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
    <div class="field-group">
      <label>${t('image')}</label>
      <div class="image-upload-row">
        <img id="prod-img-preview" class="image-preview" src="${product && product.image ? product.image : placeholderImg()}" />
        <div class="image-upload-actions">
          <label for="prod-img-file" class="btn btn-ghost btn-sm">${t('chooseImage')}</label>
          <input id="prod-img-file" type="file" accept="image/*" class="hidden" />
          <span id="prod-img-status" class="image-upload-status"></span>
        </div>
        <input id="prod-img-url" type="hidden" value="${escapeAttr(product ? product.image : '')}" />
      </div>
    </div>
    <button id="btn-save-prod" class="btn btn-primary btn-block">${t('save')}</button>
  `;

  wireImageUpload({
    fileInputId: 'prod-img-file',
    previewId: 'prod-img-preview',
    statusId: 'prod-img-status',
    onUploaded: (url) => { document.getElementById('prod-img-url').value = url; }
  });

  document.getElementById('btn-save-prod').addEventListener('click', async () => {
    const payload = {
      name: document.getElementById('prod-name').value,
      price: Number(document.getElementById('prod-price').value),
      categoryId: Number(document.getElementById('prod-category').value) || null,
      description: document.getElementById('prod-desc').value,
      image: document.getElementById('prod-img-url').value,
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
    logo: document.getElementById('setting-logo').value,
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

/* ============================================================================
   QR Code Modal Logic
   ========================================================================== */
window.showTableQR = function(tableId, tableName) {
  const overlay = document.getElementById('qr-modal-overlay');
  const modal = document.getElementById('qr-modal');
  const qrContainer = document.getElementById('qrcode-container');
  const title = document.getElementById('qr-modal-title');

  qrContainer.innerHTML = '';
  if (title) title.innerText = `رمز QR - ${tableName}`;

  const tableUrl = `${window.location.origin}/?table=${tableId}`;

  new QRCode(qrContainer, {
    text: tableUrl,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

  if (overlay) overlay.classList.remove('hidden');
  if (modal) modal.classList.remove('hidden');
};

window.closeQrModal = function() {
  const overlay = document.getElementById('qr-modal-overlay');
  const modal = document.getElementById('qr-modal');
  if (overlay) overlay.classList.add('hidden');
  if (modal) modal.classList.add('hidden');
};

/* ============================================================================
   Event listeners & Entry Point
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  init();

  // Buttons & Controls
  document.getElementById('btn-confirm-table')?.addEventListener('click', confirmTableSelection);
  document.getElementById('btn-cart')?.addEventListener('click', openCart);
  document.getElementById('btn-close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('btn-confirm-order')?.addEventListener('click', confirmOrder);
  
  document.getElementById('btn-settings')?.addEventListener('click', () => openModal('settings-overlay', 'settings-modal'));
  document.getElementById('btn-menu-settings')?.addEventListener('click', () => openModal('settings-overlay', 'settings-modal'));
  document.getElementById('btn-close-settings')?.addEventListener('click', () => closeModal('settings-overlay', 'settings-modal'));
  
  document.getElementById('btn-open-admin')?.addEventListener('click', () => {
    closeModal('settings-overlay', 'settings-modal');
    openModal('admin-login-overlay', 'admin-login-modal');
  });
  document.getElementById('btn-close-admin-login')?.addEventListener('click', () => closeModal('admin-login-overlay', 'admin-login-modal'));
  document.getElementById('btn-submit-admin-code')?.addEventListener('click', submitAdminCode);
  
  document.getElementById('btn-new-order')?.addEventListener('click', () => goToCustomerHome());
  document.getElementById('btn-exit-admin')?.addEventListener('click', () => goToCustomerHome());
  
  document.getElementById('btn-admin-logout')?.addEventListener('click', async () => {
    try { await api('/api/admin/logout', { method: 'POST' }); } catch {}
    goToCustomerHome();
  });

  // Admin Nav buttons
  document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchAdminView(btn.dataset.view));
  });

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // Admin Actions
  document.getElementById('btn-add-product')?.addEventListener('click', () => openProductEditor());
  document.getElementById('btn-add-category')?.addEventListener('click', () => openCategoryEditor());
  document.getElementById('btn-add-table')?.addEventListener('click', () => openTableEditor());
  document.getElementById('btn-save-settings')?.addEventListener('click', saveSettings);

  // Settings Logo Upload Setup
  wireImageUpload({
    fileInputId: 'setting-logo-file',
    previewId: 'setting-logo-preview',
    statusId: 'setting-logo-status',
    onUploaded: (url) => { document.getElementById('setting-logo').value = url; }
  });
});
