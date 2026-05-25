USE BookStore;

INSERT INTO users (username, email, password_hash, role, full_name, phone, address)
VALUES
  ('admin', 'admin@bookstore.local', 'hashed_admin_password', 'admin', 'Admin User', '0000000000', 'Hanoi'),
  ('alice', 'alice@bookstore.local', 'hashed_alice_password', 'customer', 'Alice Nguyen', '0911001100', 'Ho Chi Minh')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone = VALUES(phone),
  address = VALUES(address);

INSERT INTO categories (name, description)
VALUES
  ('Fiction', 'Stories and novels'),
  ('Programming', 'Software and engineering'),
  ('Business', 'Management and entrepreneurship')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO books (title, author, description, image_url, price, category_id)
VALUES
  (
    'Clean Code',
    'Robert C. Martin',
    'A handbook of agile software craftsmanship',
    'https://example.com/images/clean-code.jpg',
    19.99,
    (SELECT id FROM categories WHERE name = 'Programming' LIMIT 1)
  ),
  (
    'The Pragmatic Programmer',
    'Andrew Hunt',
    'Journey to mastery in software development',
    'https://example.com/images/pragmatic-programmer.jpg',
    24.50,
    (SELECT id FROM categories WHERE name = 'Programming' LIMIT 1)
  ),
  (
    'The Lean Startup',
    'Eric Ries',
    'Innovation and entrepreneurship strategy',
    'https://example.com/images/the-lean-startup.jpg',
    15.75,
    (SELECT id FROM categories WHERE name = 'Business' LIMIT 1)
  ),
  (
    '1984',
    'George Orwell',
    'Dystopian classic novel',
    'https://example.com/images/1984.jpg',
    9.99,
    (SELECT id FROM categories WHERE name = 'Fiction' LIMIT 1)
  )
ON DUPLICATE KEY UPDATE
  price = VALUES(price),
  description = VALUES(description);

INSERT INTO invoices (user_id, total_amount, status, note)
VALUES
  (
    (SELECT id FROM users WHERE username = 'alice' LIMIT 1),
    34.49,
    'paid',
    'Sample invoice'
  );

INSERT INTO invoice_items (invoice_id, book_id, quantity, unit_price)
VALUES
  (
    (SELECT id FROM invoices ORDER BY id DESC LIMIT 1),
    (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
    1,
    19.99
  ),
  (
    (SELECT id FROM invoices ORDER BY id DESC LIMIT 1),
    (SELECT id FROM books WHERE title = '1984' LIMIT 1),
    1,
    9.99
  );
