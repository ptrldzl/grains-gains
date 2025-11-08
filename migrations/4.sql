
-- Create a temporary table with the existing dishes
CREATE TEMPORARY TABLE dishes_temp AS SELECT * FROM dishes;

-- Clear the dishes table
DELETE FROM dishes;

-- Reset the auto-increment counter
DELETE FROM sqlite_sequence WHERE name='dishes';

-- Insert the dishes back with sequential IDs starting from 1
INSERT INTO dishes (name, description, calories, protein, carbs, fats, price, is_vegetarian, image_url, available, created_at, updated_at)
SELECT name, description, calories, protein, carbs, fats, price, is_vegetarian, image_url, available, created_at, updated_at 
FROM dishes_temp ORDER BY id;

-- Add 6 additional dishes to restore the original count
INSERT INTO dishes (name, description, calories, protein, carbs, fats, price, is_vegetarian, image_url, available, created_at, updated_at) VALUES
('Mediterranean Salmon Bowl', 'Grilled salmon, quinoa, roasted vegetables, tahini dressing', 520, 42, 28, 24, 389, 0, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now')),
('Spiced Chickpea Curry', 'Protein-rich chickpeas in aromatic spices with brown rice', 380, 18, 52, 8, 189, 1, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now')),
('BBQ Pulled Chicken Wrap', 'Slow-cooked BBQ chicken, coleslaw, whole wheat tortilla', 440, 32, 35, 18, 279, 0, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now')),
('Superfood Green Smoothie Bowl', 'Spinach, banana, protein powder, chia seeds, almond butter', 320, 25, 22, 12, 229, 1, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now')),
('Korean Beef Bowl', 'Marinated beef, kimchi, brown rice, sesame vegetables', 480, 35, 38, 20, 349, 0, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now')),
('Lentil Power Salad', 'Mixed greens, cooked lentils, roasted sweet potato, tahini dressing', 360, 16, 45, 10, 199, 1, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', 1, datetime('now'), datetime('now'));

-- Drop the temporary table
DROP TABLE dishes_temp;
