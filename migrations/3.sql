
-- Delete the first 6 dishes (IDs 7-12, since IDs 1-6 don't exist)
DELETE FROM dishes WHERE id IN (7, 8, 9, 10, 11, 12);
