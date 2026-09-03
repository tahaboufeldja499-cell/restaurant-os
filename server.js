// Restaurant OS — backend server
// Node.js + Express + better-sqlite3
'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const multer = require('multer');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ADMIN_CODE = process.env.ADMIN_CODE || 'CHANGE_THIS_ADMIN_CODE';
const SESSION_SECRET = process.env.SESSION_SECRET || 'CHANGE_THIS_SESSION_SECRET';
const SESSION_HOURS = Number(process.env.SESSION_HOURS || 12);
const SESSION_COOKIE = 'ros_admin_session';

if (ADMIN_CODE === 'CHANGE_THIS_ADMIN_CODE' || SESSION_SECRET === 'CHANGE_THIS_SESSION_SECRET') {
  console.warn('\n[SECURITY WARNING] You are using the default ADMIN_CODE and/or SESSION_SECRET.');
  console.warn('Set real values in your .env file before deploying to production.\n');
}

// ---------------------------------------------------------------------------
// Database setup & Safety Checks for Render
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'restaurant.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'empty'
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    category_id INTEGER,
    image TEXT DEFAULT '',
    available INTEGER NOT NULL DEFAULT 1,
    featured INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER,
    table_name TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------
function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
ensureColumn('tables', 'status', "TEXT NOT NULL DEFAULT 'empty'");
ensureColumn('orders', 'table_id', 'INTEGER');

db.exec(`
  UPDATE orders SET table_id = (SELECT id FROM tables WHERE tables.name = orders.table_name)
  WHERE table_id IS NULL
`);

// ---------------------------------------------------------------------------
// Seed demo data on first run
// ---------------------------------------------------------------------------
function seedIfEmpty() {
  const tableCount = db.prepare('SELECT COUNT(*) AS c FROM tables').get().c;
  if (tableCount === 0) {
    const insertTable = db.prepare('INSERT INTO tables (name, active) VALUES (?, 1)');
    const insertMany = db.transaction((n) => {
      for (let i = 1; i <= n; i++) insertTable.run(`Table ${i}`);
    });
    insertMany(12);
  }

  const catCount = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c;
  let catIds = {};
  if (catCount === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const names = ['Pizza', 'Tacos', 'Sandwiches', 'Burgers', 'Extras', 'Meals', 'Drinks'];
    const insertMany = db.transaction(() => {
      for (const n of names) {
        const info = insertCat.run(n);
        catIds[n] = info.lastInsertRowid;
      }
    });
    insertMany();
  } else {
    for (const row of db.prepare('SELECT id, name FROM categories').all()) {
      catIds[row.name] = row.id;
    }
  }

  const prodCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  if (prodCount === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (name, description, price, category_id, image, available, featured)
      VALUES (@name, @description, @price, @category_id, @image, 1, @featured)
    `);
    const demo = [
      {
        name: 'Margherita',
        description: 'Tomato, mozzarella and basil',
        price: 650,
        category_id: catIds['Pizza'],
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80',
        featured: 1,
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with mozzarella and tomato sauce',
        price: 750,
        category_id: catIds['Pizza'],
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
        featured: 0,
      },
      {
        name: 'Chicken Tacos',
        description: 'Grilled chicken, salsa, onions and fresh coriander',
        price: 450,
        category_id: catIds['Tacos'],
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
        featured: 1,
      },
      {
        name: 'Club Sandwich',
        description: 'Chicken, egg, lettuce, tomato and mayonnaise',
        price: 500,
        category_id: catIds['Sandwiches'],
        image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=800&q=80',
        featured: 0,
      },
      {
        name: 'Double Burger',
        description: 'Double beef patty, cheddar, lettuce and secret sauce',
        price: 800,
        category_id: catIds['Burgers'],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        featured: 1,
      },
      {
        name: 'Fries',
        description: 'Crispy golden fries with a pinch of salt',
        price: 250,
        category_id: catIds['Extras'],
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
        featured: 0,
      },
      {
        name: 'Grilled Chicken Meal',
        description: 'Grilled chicken breast, rice and grilled vegetables',
        price: 900,
        category_id: catIds['Meals'],
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80',
        featured: 0,
      },
      {
        name: 'Fresh Lemonade',
        description: 'Freshly squeezed lemons with mint',
        price: 200,
        category_id: catIds['Drinks'],
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
        featured: 0,
      },
      {
        name: 'Coca Cola',
        description: 'Chilled 33cl can',
        price: 150,
        category_id: catIds['Drinks'],
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80',
        featured: 0,
      },
    ];
    const insertMany = db.transaction(() => {
      for (const p of demo) insertProd.run(p);
    });
    insertMany();
  }

  const defaults = {
    restaurant_name: 'Restaurant OS',
    logo: '',
    phone: '',
    address: '',
    opening_message: 'Welcome! Choose your table and start your order.',
    open: '1',
  };
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  const existing = new Set(db.prepare('SELECT key FROM settings').all().map((r) => r.key));
  const insertMany = db.transaction(() => {
    for (const [k, v] of Object.entries(defaults)) {
      if (!existing.has(k)) insertSetting.run(k, v);
    }
  });
  insertMany();
}
seedIfEmpty();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  return obj;
}

function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, String(value));
}

function sign(payload) {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString('base64url');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(b64).digest('base64url');
  return `${b64}.${hmac}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [b64, hmac] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(b64).digest('base64url');
  const a = Buffer.from(hmac || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function createAdminSession(res) {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const token = sign({ role: 'admin', exp });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: NODE_ENV === 'production',
    maxAge: SESSION_HOURS * 60 * 60 * 1000,
    path: '/',
  });
}

function requireAdmin(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  const payload = verify(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function isNonEmptyString(v, maxLen = 300) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen;
}

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

function toBool01(v) {
  return v ? 1 : 0;
}

const loginAttempts = new Map();
function tooManyAttempts(ip) {
  const rec = loginAttempts.get(ip);
  const now = Date.now();
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 0, resetAt: now + 5 * 60 * 1000 });
    return false;
  }
  return rec.count >= 10;
}
function registerAttempt(ip) {
  const rec = loginAttempts.get(ip);
  if (rec) rec.count += 1;
}

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// Image uploads setup
// ---------------------------------------------------------------------------
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || '').toLowerCase().slice(0, 10);
      const safeExt = /^\.(jpg|jpeg|png|gif|webp|avif)$/.test(ext) ? ext : '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpeg|png|gif|webp|avif)$/.test(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

app.post('/api/admin/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
app.get('/api/public', (req, res) => {
  const settings = getSettings();
  const tables = db.prepare('SELECT id, name FROM tables WHERE active = 1 ORDER BY id').all();
  const categories = db.prepare('SELECT id, name FROM categories ORDER BY id').all();
  const products = db.prepare(`
    SELECT id, name, description, price, category_id, image, featured
    FROM products WHERE available = 1 ORDER BY id
  `).all();

  res.json({
    restaurant: {
      name: settings.restaurant_name || 'Restaurant OS',
      logo: settings.logo || '',
      phone: settings.phone || '',
      address: settings.address || '',
      openingMessage: settings.opening_message || '',
      open: settings.open !== '0',
    },
    tables,
    categories,
    products,
  });
});

app.post('/api/orders', (req, res) => {
  const settings = getSettings();
  if (settings.open === '0') {
    return res.status(403).json({ error: 'Restaurant is currently closed' });
  }

  const { tableId, items } = req.body || {};

  if (!isFiniteNumber(tableId)) {
    return res.status(400).json({ error: 'Invalid table' });
  }
  const table = db.prepare('SELECT * FROM tables WHERE id = ? AND active = 1').get(tableId);
  if (!table) {
    return res.status(400).json({ error: 'Invalid or inactive table' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (items.length > 100) {
    return res.status(400).json({ error: 'Too many items' });
  }

  const cleanItems = [];
  for (const raw of items) {
    const productId = Number(raw && raw.productId);
    const qty = Number(raw && raw.qty);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: 'Invalid product' });
    }
    if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    const product = db.prepare('SELECT * FROM products WHERE id = ? AND available = 1').get(productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${productId} is not available` });
    }
    cleanItems.push({ product, qty });
  }

  const total = cleanItems.reduce((sum, it) => sum + it.product.price * it.qty, 0);

  const insertOrder = db.prepare(`
    INSERT INTO orders (table_id, table_name, total, status) VALUES (?, ?, ?, 'NEW')
  `);
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, name, price, qty)
    VALUES (?, ?, ?, ?, ?)
  `);
  const occupyTable = db.prepare(`UPDATE tables SET status = 'occupied' WHERE id = ?`);

  const createOrder = db.transaction(() => {
    const info = insertOrder.run(table.id, table.name, total);
    const orderId = info.lastInsertRowid;
    for (const it of cleanItems) {
      insertItem.run(orderId, it.product.id, it.product.name, it.product.price, it.qty);
    }
    occupyTable.run(table.id);
    return orderId;
  });

  const orderId = createOrder();
  res.status(201).json({ orderId, total });
});

// ---------------------------------------------------------------------------
// Public: order status polling
// ---------------------------------------------------------------------------
app.get('/api/orders/status', (req, res) => {
  const idsParam = req.query.ids;
  if (!isNonEmptyString(idsParam, 500)) return res.json({ orders: [] });

  const ids = String(idsParam)
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 50);
  if (ids.length === 0) return res.json({ orders: [] });

  const placeholders = ids.map(() => '?').join(',');
  const rows = db.prepare(`
    SELECT id, status, table_name, total, created_at
    FROM orders WHERE id IN (${placeholders})
  `).all(...ids);
  res.json({ orders: rows });
});

app.post('/api/orders/:id/confirm', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order id' });

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'DELIVERED') {
    return res.status(400).json({ error: 'Order is not marked as delivered yet' });
  }

  db.prepare(`UPDATE orders SET status = 'COMPLETED' WHERE id = ?`).run(id);
  res.json({ ok: true, status: 'COMPLETED' });
});

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || 'unknown';
  if (tooManyAttempts(ip)) {
    return res.status(429).json({ error: 'Too many attempts, try again later' });
  }
  const { code } = req.body || {};
  if (!isNonEmptyString(code, 200)) {
    registerAttempt(ip);
    return res.status(401).json({ error: 'Invalid admin code' });
  }

  const a = Buffer.from(String(code));
  const b = Buffer.from(String(ADMIN_CODE));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    registerAttempt(ip);
    return res.status(401).json({ error: 'Invalid admin code' });
  }

  createAdminSession(res);
  res.json({ ok: true });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/me', (req, res) => {
  const payload = verify(req.cookies[SESSION_COOKIE]);
  res.json({ authenticated: !!payload });
});

// ---------------------------------------------------------------------------
// Admin: dashboard data
// ---------------------------------------------------------------------------
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  const byStatus = (status) =>
    db.prepare('SELECT COUNT(*) AS c FROM orders WHERE status = ?').get(status).c;
  const revenue = db.prepare(`
    SELECT COALESCE(SUM(total), 0) AS r FROM orders WHERE status != 'CANCELLED'
  `).get().r;

  res.json({
    totalOrders: total,
    newOrders: byStatus('NEW'),
    preparing: byStatus('PREPARING'),
    ready: byStatus('READY'),
    delivered: byStatus('DELIVERED'),
    completed: byStatus('COMPLETED'),
    cancelled: byStatus('CANCELLED'),
    totalRevenue: revenue,
  });
});

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  const itemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const result = orders.map((o) => ({ ...o, items: itemStmt.all(o.id) }));
  res.json(result);
});

const VALID_STATUSES = ['NEW', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order id' });
  if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) return res.status(404).json({ error: 'Order not found' });
  res.json({ ok: true });
});

app.get('/api/admin/data', requireAdmin, (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id').all();
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  const tables = db.prepare('SELECT * FROM tables ORDER BY id').all();
  const settings = getSettings();
  res.json({ products, categories, tables, settings });
});

// ---------------------------------------------------------------------------
// Admin: products
// ---------------------------------------------------------------------------
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const { name, description, price, category_id, image, available, featured } = req.body || {};
  if (!isNonEmptyString(name, 150)) return res.status(400).json({ error: 'Invalid name' });
  if (!isFiniteNumber(price) || price < 0) return res.status(400).json({ error: 'Invalid price' });
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid description' });
  }
  if (image !== undefined && typeof image !== 'string') {
    return res.status(400).json({ error: 'Invalid image' });
  }
  let catId = null;
  if (category_id !== undefined && category_id !== null) {
    if (!Number.isInteger(category_id)) return res.status(400).json({ error: 'Invalid category' });
    const cat = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
    if (!cat) return res.status(400).json({ error: 'Category not found' });
    catId = category_id;
  }

  const info = db.prepare(`
    INSERT INTO products (name, description, price, category_id, image, available, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    (description || '').trim(),
    price,
    catId,
    (image || '').trim(),
    toBool01(available !== false),
    toBool01(!!featured)
  );
  res.status(201).json({ id: info.lastInsertRowid });
});

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id' });
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const { name, description, price, category_id, image, available, featured } = req.body || {};
  if (!isNonEmptyString(name, 150)) return res.status(400).json({ error: 'Invalid name' });
  if (!isFiniteNumber(price) || price < 0) return res.status(400).json({ error: 'Invalid price' });

  let catId = null;
  if (category_id !== undefined && category_id !== null) {
    if (!Number.isInteger(category_id)) return res.status(400).json({ error: 'Invalid category' });
    const cat = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
    if (!cat) return res.status(400).json({ error: 'Category not found' });
    catId = category_id;
  }

  db.prepare(`
    UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ?, available = ?, featured = ?
    WHERE id = ?
  `).run(
    name.trim(),
    (description || '').trim(),
    price,
    catId,
    (image || '').trim(),
    toBool01(available !== false),
    toBool01(!!featured),
    id
  );
  res.json({ ok: true });
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id' });
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Admin: categories
// ---------------------------------------------------------------------------
app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const { name } = req.body || {};
  if (!isNonEmptyString(name, 100)) return res.status(400).json({ error: 'Invalid name' });
  const info = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
  res.status(201).json({ id: info.lastInsertRowid });
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid category id' });
  if (!isNonEmptyString(name, 100)) return res.status(400).json({ error: 'Invalid name' });
  const info = db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name.trim(), id);
  if (info.changes === 0) return res.status(404).json({ error: 'Category not found' });
  res.json({ ok: true });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid category id' });
  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  const tx = db.transaction(() => {
    db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  });
  tx();
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Admin: tables
// ---------------------------------------------------------------------------
app.post('/api/admin/tables', requireAdmin, (req, res) => {
  const { name } = req.body || {};
  if (!isNonEmptyString(name, 100)) return res.status(400).json({ error: 'Invalid name' });
  const info = db.prepare('INSERT INTO tables (name, active) VALUES (?, 1)').run(name.trim());
  res.status(201).json({ id: info.lastInsertRowid });
});

app.patch('/api/admin/tables/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid table id' });
  const existing = db.prepare('SELECT * FROM tables WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Table not found' });

  const { name, active, status } = req.body || {};
  const newName = name !== undefined ? name : existing.name;
  const newActive = active !== undefined ? toBool01(!!active) : existing.active;
  if (!isNonEmptyString(newName, 100)) return res.status(400).json({ error: 'Invalid name' });

  let newStatus = existing.status;
  if (status !== undefined) {
    if (!['empty', 'occupied'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    newStatus = status;
  }

  db.prepare('UPDATE tables SET name = ?, active = ?, status = ? WHERE id = ?').run(newName.trim(), newActive, newStatus, id);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Admin: restaurant settings
// ---------------------------------------------------------------------------
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const { restaurant_name, logo, phone, address, opening_message, open } = req.body || {};
  if (restaurant_name !== undefined) {
    if (!isNonEmptyString(restaurant_name, 150)) return res.status(400).json({ error: 'Invalid name' });
    setSetting('restaurant_name', restaurant_name.trim());
  }
  if (logo !== undefined) setSetting('logo', String(logo).trim().slice(0, 2000));
  if (phone !== undefined) setSetting('phone', String(phone).trim().slice(0, 50));
  if (address !== undefined) setSetting('address', String(address).trim().slice(0, 300));
  if (opening_message !== undefined) setSetting('opening_message', String(opening_message).trim().slice(0, 300));
  if (open !== undefined) setSetting('open', open ? '1' : '0');
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Fallback: serve SPA
// ---------------------------------------------------------------------------
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Restaurant OS running at http://localhost:${PORT}`);
});
