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
// Database setup
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, 'data');

// إنشاء مجلد data تلقائياً إذا لم يكن موجوداً لمنع خطأ TypeError في Render
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
    active INTEGER NOT NULL DEFAULT 1
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
