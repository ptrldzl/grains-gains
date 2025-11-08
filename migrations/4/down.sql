-- Remove the 6 added dishes (IDs 8–13 in the restored state)
DELETE FROM dishes WHERE id > 7;

-- Create a temporary table with remaining dishes
CREATE TEMPORARY TABLE dishes_temp AS SELECT * FROM dishes;

-- Clear the dishes table
DELETE FROM dishes;

-- NOTE: Removed sqlite_sequence manipulation (not allowed in Cloudflare D1)

-- Reinsert the dishes back in order
INSERT INTO dishes (
  name,
  description,
  calories,
  protein,
  carbs,
  fats,
  price,
  is_vegetarian,
  image_url,
  available,
  created_at,
  updated_at
)
SELECT
  name,
  description,
  calories,
  protein,
  carbs,
  fats,
  price,
  is_vegetarian,
  image_url,
  available,
  created_at,
  updated_at
FROM dishes_temp
ORDER BY id;

-- Drop the temporary table
DROP TABLE dishes_temp;
