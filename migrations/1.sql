
CREATE TABLE dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fats REAL,
  price REAL NOT NULL,
  category TEXT,
  is_vegetarian BOOLEAN DEFAULT 0,
  is_high_protein BOOLEAN DEFAULT 0,
  is_low_calorie BOOLEAN DEFAULT 0,
  image_url TEXT,
  available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kiosk_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  campus TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cloud_kitchens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  delivery_radius REAL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  order_type TEXT NOT NULL, -- 'kiosk' or 'delivery'
  location_id INTEGER,
  total_amount REAL NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  pickup_time TIMESTAMP,
  delivery_address TEXT,
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  dish_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_vegetarian ON dishes(is_vegetarian);
CREATE INDEX idx_orders_user_email ON orders(user_email);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
