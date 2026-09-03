const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// In-Memory Database / State Management
// ==========================================
let restaurantData = {
  name: "مطعم السعادة",
  phone: "0550000000",
  address: "وهران، الجزائر",
  openingMessage: "مرحباً بكم في مطعمنا!",
  open: true,
  logo: ""
};

let categories = [
  { id: 1, name: "وجبات رئيسية" },
  { id: 2, name: "مشروبات" }
];

let products = [
  { id: 101, category_id: 1, name: "برغر لحم دبل", price: 800, description: "برغر لحم طازج مع الجبن والصوص الخاص", image: "" },
  { id: 102, category_id: 2, name: "عصير برتقال طازج", price: 250, description: "عصير برتقال طبيعي 100%", image: "" }
];

let tables = [
  { id: 1, name: "طاولة 1", status: "empty" },
  { id: 2, name: "طاولة 2", status: "empty" },
  { id: 3, name: "طاولة 3", status: "empty" },
  { id: 4, name: "طاولة 4", status: "empty" }
];

let orders = [];
let ADMIN_PASSCODE = "1234";

// ==========================================
// Public Endpoints (Client)
// ==========================================

// جلب البيانات العامة للزبون
app.get('/api/public', (req, res) => {
  res.json({
    restaurant: restaurantData,
    categories: categories,
    products: products,
    tables: tables
  });
});

// إرسال طلب جديد من الزبون
app.post('/api/orders', (req, res) => {
  const { tableId, items, totalPrice, customerNote } = req.body;

  if (!tableId || !items || items.length === 0) {
    return res.status(400).json({ error: "بيانات الطلب غير مكتملة" });
  }

  const newOrder = {
    id: Date.now(),
    tableId: Number(tableId),
    items: items,
    totalPrice: totalPrice,
    customerNote: customerNote || "",
    status: "pending", // pending, preparing, delivered, confirmed, cancelled
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // تحديث حالة الطاولة تلقائياً إلى "مشغولة"
  const table = tables.find(t => t.id === Number(tableId));
  if (table) {
    table.status = "occupied";
  }

  res.status(201).json({ success: true, order: newOrder });
});

// مراجعة حالة الطلب الحالي (Polling من الزبون)
app.get('/api/orders/:id/status', (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  res.json({ id: order.id, status: order.status, tableId: order.tableId });
});

// تأكيد الزبون باستلام الطلب وإغلاقه
app.post('/api/orders/:id/confirm-receipt', (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  order.status = "confirmed";
  res.json({ success: true, status: order.status });
});

// ==========================================
// Admin Middleware & Endpoints
// ==========================================

// تسجيل دخول الأدمن
app.post('/api/admin/login', (req, res) => {
  const { code } = req.body;
  if (code === ADMIN_PASSCODE) {
    res.json({ success: true, token: "admin-token-secret-pass" });
  } else {
    res.status(401).json({ error: "كود الدخول غير صحيح" });
  }
});

// جلب جميع البيانات الخاصة باللوحة
app.get('/api/admin/data', (req, res) => {
  res.json({
    restaurant: restaurantData,
    categories: categories,
    products: products,
    tables: tables,
    orders: orders
  });
});

// جلب الطلبات فقط
app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

// تحديث حالة الطلب من طرف الأدمن
app.patch('/api/admin/orders/:id/status', (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  order.status = status;
  res.json({ success: true, order });
});

// تحديث حالة الطاولة (مشغولة / فارغة)
app.patch('/api/admin/tables/:id/status', (req, res) => {
  const tableId = Number(req.params.id);
  const { status } = req.body;

  const table = tables.find(t => t.id === tableId);
  if (!table) {
    return res.status(404).json({ error: "الطاولة غير موجودة" });
  }

  table.status = status;
  res.json({ success: true, table });
});

// إدارة المنتجات
app.post('/api/admin/products', (req, res) => {
  const { name, price, categoryId, description, image } = req.body;
  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price),
    category_id: Number(categoryId),
    description: description || "",
    image: image || ""
  };
  products.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
  const pId = Number(req.params.id);
  const index = products.findIndex(p => p.id === pId);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body, price: Number(req.body.price) };
    return res.json({ success: true, product: products[index] });
  }
  res.status(404).json({ error: "المنتج غير موجود" });
});

app.delete('/api/admin/products/:id', (req, res) => {
  const pId = Number(req.params.id);
  products = products.filter(p => p.id !== pId);
  res.json({ success: true });
});

// إدارة التصنيفات
app.post('/api/admin/categories', (req, res) => {
  const { name } = req.body;
  const newCategory = { id: Date.now(), name };
  categories.push(newCategory);
  res.status(201).json({ success: true, category: newCategory });
});

app.put('/api/admin/categories/:id', (req, res) => {
  const cId = Number(req.params.id);
  const cat = categories.find(c => c.id === cId);
  if (cat) {
    cat.name = req.body.name;
    return res.json({ success: true, category: cat });
  }
  res.status(404).json({ error: "التصنيف غير موجود" });
});

app.delete('/api/admin/categories/:id', (req, res) => {
  const cId = Number(req.params.id);
  categories = categories.filter(c => c.id !== cId);
  res.json({ success: true });
});

// إدارة الطاولات
app.post('/api/admin/tables', (req, res) => {
  const { name } = req.body;
  const newTable = { id: Date.now(), name, status: "empty" };
  tables.push(newTable);
  res.status(201).json({ success: true, table: newTable });
});

app.put('/api/admin/tables/:id', (req, res) => {
  const tId = Number(req.params.id);
  const tb = tables.find(t => t.id === tId);
  if (tb) {
    tb.name = req.body.name;
    return res.json({ success: true, table: tb });
  }
  res.status(404).json({ error: "الطاولة غير موجودة" });
});

app.delete('/api/admin/tables/:id', (req, res) => {
  const tId = Number(req.params.id);
  tables = tables.filter(t => t.id !== tId);
  res.json({ success: true });
});

// إعدادات المطعم
app.put('/api/admin/settings', (req, res) => {
  restaurantData = { ...restaurantData, ...req.body };
  res.json({ success: true, restaurant: restaurantData });
});

// Route الرئيسي للواجهة الأمامية
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
