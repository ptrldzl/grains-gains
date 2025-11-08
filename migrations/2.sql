
-- Delete dishes with IDs 7-12 (the first 6 dishes in the current database)
DELETE FROM dishes WHERE id IN (7, 8, 9, 10, 11, 12);

-- Update the sqlite_sequence to reset the autoincrement counter
UPDATE sqlite_sequence SET seq = 6 WHERE name = 'dishes';
