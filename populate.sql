-- Seed Data Script

-- Users
INSERT INTO users (user_id, name, email, password, phone_number, role_id) VALUES (1, 'Susan Ray', 'paul36@gmail.com', 'hashed_password', '768-749-5675', 'customer');
INSERT INTO users (user_id, name, email, password, phone_number, role_id) VALUES (2, 'Michael Hampton', 'laura04@gmail.com', 'hashed_password', '(298)772-6719x591', 'rider');
INSERT INTO users (user_id, name, email, password, phone_number, role_id) VALUES (3, 'Ryan White', 'amanda66@lowe.net', 'hashed_password', '(300)992-8326', 'customer');
INSERT INTO users (user_id, name, email, password, phone_number, role_id) VALUES (4, 'Tracy Boyd', 'larsenchristian@yahoo.com', 'hashed_password', '413.855.1738', 'rider');
INSERT INTO users (user_id, name, email, password, phone_number, role_id) VALUES (5, 'Elizabeth Fry', 'pamela20@green.com', 'hashed_password', '733-208-3124', 'rider');

-- Rider Profiles
INSERT INTO rider_profiles (user_id, vehicle_type, current_location, is_available) VALUES (2, 'bike', 'USNV Booker
FPO AA 21297', true);
INSERT INTO rider_profiles (user_id, vehicle_type, current_location, is_available) VALUES (4, 'bike', '127 Danielle Views
North Paul, LA 04530', true);
INSERT INTO rider_profiles (user_id, vehicle_type, current_location, is_available) VALUES (5, 'bike', '4507 Katie Island
South Katrinamouth, AR 28386', true);

-- User Locations
INSERT INTO user_locations (location_id, user_id, street, city, postal_code, latitude, longitude, addr_link, is_primary) VALUES (1, 4, '891 Espinoza Trail Apt. 732', 'West Stephanieborough', '36686', 29.48448506, -11.17003903, 'https://unsplash.com/photos/burger-with-vegetable-on-brown-wooden-tray-I7A_pHLcQK8', true);
INSERT INTO user_locations (location_id, user_id, street, city, postal_code, latitude, longitude, addr_link, is_primary) VALUES (2, 1, '64596 Jacqueline Fork', 'Port Brandonshire', '68874', 4.34894799, 74.09282236, 'http://www.riley.com/', true);
INSERT INTO user_locations (location_id, user_id, street, city, postal_code, latitude, longitude, addr_link, is_primary) VALUES (3, 4, '5512 Brenda Highway Apt. 830', 'West Michael', '44535', -34.69259652, 79.81143658, 'https://www.santos-sharp.biz/', true);
INSERT INTO user_locations (location_id, user_id, street, city, postal_code, latitude, longitude, addr_link, is_primary) VALUES (4, 3, '4829 Greg River Apt. 874', 'East Stevenside', '56975', 82.63795744, 44.31077383, 'https://www.wade-bowman.biz/', true);
INSERT INTO user_locations (location_id, user_id, street, city, postal_code, latitude, longitude, addr_link, is_primary) VALUES (5, 2, '4637 Alexis Isle Apt. 403', 'Port Mandybury', '85357', 51.06911149, -119.15858999, 'https://reyes.net/', true);

-- Restaurants
INSERT INTO restaurants (restaurant_id, name, password, phone, email, location_id, average_rating) VALUES (1, 'Black, Davis and Simon', 'hashed_password', '489.159.3776', 'sandra22@hotmail.com', 1, 3.32);
INSERT INTO restaurants (restaurant_id, name, password, phone, email, location_id, average_rating) VALUES (2, 'Atkinson, Price and Williams', 'hashed_password', '598-533-6698x417', 'randallmcintyre@gutierrez-carroll.com', 2, 3.77);
INSERT INTO restaurants (restaurant_id, name, password, phone, email, location_id, average_rating) VALUES (3, 'Fisher PLC', 'hashed_password', '001-591-386-3262x276', 'millerdiana@yahoo.com', 3, 4.34);
INSERT INTO restaurants (restaurant_id, name, password, phone, email, location_id, average_rating) VALUES (4, 'Robles LLC', 'hashed_password', '001-660-697-9159x15752', 'suzanne68@navarro.biz', 4, 3.48);
INSERT INTO restaurants (restaurant_id, name, password, phone, email, location_id, average_rating) VALUES (5, 'Cook LLC', 'hashed_password', '639-438-0388', 'kevin36@robinson.com', 5, 4.92);

-- Restaurant Hours
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (1, 'Mon', '10:00', '19:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (1, 'Sat', '9:00', '20:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (1, 'Sun', '8:00', '16:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (1, 'Thu', '10:00', '19:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (1, 'Wed', '11:00', '21:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (2, 'Wed', '8:00', '18:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (2, 'Mon', '11:00', '21:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (2, 'Tue', '8:00', '16:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (2, 'Sun', '10:00', '19:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (2, 'Sat', '11:00', '21:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (3, 'Tue', '10:00', '21:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (3, 'Thu', '11:00', '19:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (3, 'Sun', '10:00', '22:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (3, 'Mon', '10:00', '22:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (3, 'Fri', '8:00', '18:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (4, 'Tue', '8:00', '17:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (4, 'Sat', '10:00', '20:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (4, 'Thu', '10:00', '20:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (4, 'Mon', '11:00', '19:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (4, 'Fri', '10:00', '22:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (5, 'Tue', '10:00', '22:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (5, 'Fri', '8:00', '20:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (5, 'Thu', '9:00', '20:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (5, 'Sun', '9:00', '18:00');
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES (5, 'Wed', '8:00', '17:00');

-- Menu Categories
INSERT INTO menu_categories (category_id, restaurant_id, name) VALUES (1, 1, 'simple');
INSERT INTO menu_categories (category_id, restaurant_id, name) VALUES (2, 2, 'money');
INSERT INTO menu_categories (category_id, restaurant_id, name) VALUES (3, 3, 'lay');
INSERT INTO menu_categories (category_id, restaurant_id, name) VALUES (4, 4, 'travel');
INSERT INTO menu_categories (category_id, restaurant_id, name) VALUES (5, 5, 'even');

-- Menu Items
INSERT INTO menu_items (menu_item_id, category_id, name, description, price) VALUES (1, 1, 'across', 'Partner from fly movie media receive.', 32.15);
INSERT INTO menu_items (menu_item_id, category_id, name, description, price) VALUES (2, 2, 'anyone', 'Right seat manage poor late.', 35.15);
INSERT INTO menu_items (menu_item_id, category_id, name, description, price) VALUES (3, 3, 'magazine', 'Great late think themselves final two.', 34.62);
INSERT INTO menu_items (menu_item_id, category_id, name, description, price) VALUES (4, 4, 'or', 'Shoulder behavior yard kid meeting control operation.', 30.42);
INSERT INTO menu_items (menu_item_id, category_id, name, description, price) VALUES (5, 5, 'know', 'Expect want tree challenge eight goal.', 12.65);

-- Carts
INSERT INTO carts (cart_id, user_id, status) VALUES (1, 4, 'completed');
INSERT INTO carts (cart_id, user_id, status) VALUES (2, 4, 'completed');
INSERT INTO carts (cart_id, user_id, status) VALUES (3, 3, 'abandoned');
INSERT INTO carts (cart_id, user_id, status) VALUES (4, 3, 'active');
INSERT INTO carts (cart_id, user_id, status) VALUES (5, 1, 'abandoned');

-- Cart Items
INSERT INTO cart_item (cart_item_id, cart_id, menu_item_id, restaurant_id, quantity) VALUES (1, 1, 1, 1, 3);
INSERT INTO cart_item (cart_item_id, cart_id, menu_item_id, restaurant_id, quantity) VALUES (2, 2, 2, 2, 1);
INSERT INTO cart_item (cart_item_id, cart_id, menu_item_id, restaurant_id, quantity) VALUES (3, 3, 3, 3, 2);
INSERT INTO cart_item (cart_item_id, cart_id, menu_item_id, restaurant_id, quantity) VALUES (4, 4, 4, 4, 2);
INSERT INTO cart_item (cart_item_id, cart_id, menu_item_id, restaurant_id, quantity) VALUES (5, 5, 5, 5, 2);

-- Orders
INSERT INTO orders (order_id, user_id, restaurant_id, rider_id, status, total_amount) VALUES (1, 2, 1, 4, 'pending', 55.31);
INSERT INTO orders (order_id, user_id, restaurant_id, rider_id, status, total_amount) VALUES (2, 1, 2, 4, 'preparing', 62.07);
INSERT INTO orders (order_id, user_id, restaurant_id, rider_id, status, total_amount) VALUES (3, 4, 2, 4, 'delivered', 74.17);
INSERT INTO orders (order_id, user_id, restaurant_id, rider_id, status, total_amount) VALUES (4, 5, 3, 5, 'preparing', 167.45);
INSERT INTO orders (order_id, user_id, restaurant_id, rider_id, status, total_amount) VALUES (5, 3, 5, 5, 'cancelled', 73.94);

-- Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (1, 1, 3, 8.53);
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (2, 2, 1, 10.56);
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (3, 3, 3, 5.22);
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (4, 4, 3, 5.18);
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (5, 5, 1, 16.79);

-- Payments
INSERT INTO payments (payment_id, order_id, user_id, method_type, amount, status) VALUES (1, 1, 1, 'bkash', 67.59, 'paid');
INSERT INTO payments (payment_id, order_id, user_id, method_type, amount, status) VALUES (2, 2, 2, 'paypal', 138.84, 'paid');
INSERT INTO payments (payment_id, order_id, user_id, method_type, amount, status) VALUES (3, 3, 3, 'card', 191.65, 'paid');
INSERT INTO payments (payment_id, order_id, user_id, method_type, amount, status) VALUES (4, 4, 4, 'rocket', 190.81, 'paid');
INSERT INTO payments (payment_id, order_id, user_id, method_type, amount, status) VALUES (5, 5, 5, 'rocket', 48.94, 'paid');

-- Deliveries
INSERT INTO deliveries (delivery_id, order_id, rider_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES (1, 1, 5, 1, -43.20373777, 33.6508777, '457 Ashley Knolls Suite 388
Adamshaven, TX 32134', 'delivered');
INSERT INTO deliveries (delivery_id, order_id, rider_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES (2, 2, 4, 2, 75.50168828, 172.99266574, '8075 James Lock Suite 682
North Paigeside, CA 76755', 'pending');
INSERT INTO deliveries (delivery_id, order_id, rider_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES (3, 3, 5, 3, 72.72274284, 114.64280732, '4104 Matthew Shoals
North Julieshire, HI 45219', 'in_transit');
INSERT INTO deliveries (delivery_id, order_id, rider_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES (4, 4, 4, 4, -68.48824939, -97.68529082, '468 Lisa Curve Suite 868
North Jackshire, AK 56004', 'delivered');
INSERT INTO deliveries (delivery_id, order_id, rider_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES (5, 5, 5, 5, 28.50375148, 45.39484186, '4169 Daniel Walks
Morrisonfort, WV 65432', 'in_transit');

-- Reviews
INSERT INTO reviews (review_id, user_id, restaurant_id, rider_id, rating, comment) VALUES (1, 2, 1, 2, 2.1, 'Factor matter look green former Republican maybe artist.');
INSERT INTO reviews (review_id, user_id, restaurant_id, rider_id, rating, comment) VALUES (2, 1, 2, 5, 1.5, 'Risk discover realize young drug standard baby kid.');
INSERT INTO reviews (review_id, user_id, restaurant_id, rider_id, rating, comment) VALUES (3, 2, 3, 4, 4.6, 'Child cultural sometimes.');
INSERT INTO reviews (review_id, user_id, restaurant_id, rider_id, rating, comment) VALUES (4, 1, 4, 2, 4.4, 'Painting hotel detail director off gas claim.');
INSERT INTO reviews (review_id, user_id, restaurant_id, rider_id, rating, comment) VALUES (5, 3, 5, 5, 4.3, 'Candidate learn heart sign.');

-- Notifications
INSERT INTO notifications (notification_id, user_id, target_type, target_id, order_id, type, message) VALUES (1, 1, 'rider', 2, 1, 'delivery_status', 'Discover color voice authority hospital.');
INSERT INTO notifications (notification_id, user_id, target_type, target_id, order_id, type, message) VALUES (2, 2, 'restaurant', 1, 2, 'order_update', 'Usually quickly group whom my.');
INSERT INTO notifications (notification_id, user_id, target_type, target_id, order_id, type, message) VALUES (3, 3, 'rider', 1, 3, 'order_update', 'Candidate seven cup term.');
INSERT INTO notifications (notification_id, user_id, target_type, target_id, order_id, type, message) VALUES (4, 4, 'user', 4, 4, 'promotion', 'There wall than dream newspaper.');
INSERT INTO notifications (notification_id, user_id, target_type, target_id, order_id, type, message) VALUES (5, 5, 'restaurant', 4, 5, 'order_update', 'Happy one himself degree language point recent.');

-- Chats
INSERT INTO chats (chat_id, order_id, status, chat_type) VALUES (1, 1, 'open', 'support');
INSERT INTO chats (chat_id, order_id, status, chat_type) VALUES (2, 2, 'open', 'support');
INSERT INTO chats (chat_id, order_id, status, chat_type) VALUES (3, 3, 'open', 'support');
INSERT INTO chats (chat_id, order_id, status, chat_type) VALUES (4, 4, 'open', 'support');
INSERT INTO chats (chat_id, order_id, status, chat_type) VALUES (5, 5, 'open', 'order');

-- Chat Participants
INSERT INTO chat_participants (chat_id, user_id, role) VALUES (1, 1, 'rider');
INSERT INTO chat_participants (chat_id, user_id, role) VALUES (2, 2, 'restaurant');
INSERT INTO chat_participants (chat_id, user_id, role) VALUES (3, 3, 'restaurant');
INSERT INTO chat_participants (chat_id, user_id, role) VALUES (4, 4, 'restaurant');
INSERT INTO chat_participants (chat_id, user_id, role) VALUES (5, 5, 'rider');

-- Chat Messages
INSERT INTO chat_messages (message_id, chat_id, sender_id, message, status) VALUES (1, 1, 1, 'Take leg age guy final.', 'delivered');
INSERT INTO chat_messages (message_id, chat_id, sender_id, message, status) VALUES (2, 2, 2, 'Deal stop worry must but according instead.', 'read');
INSERT INTO chat_messages (message_id, chat_id, sender_id, message, status) VALUES (3, 3, 3, 'Section identify benefit exist concern chair east.', 'read');
INSERT INTO chat_messages (message_id, chat_id, sender_id, message, status) VALUES (4, 4, 4, 'Protect knowledge may laugh responsibility nearly question.', 'delivered');
INSERT INTO chat_messages (message_id, chat_id, sender_id, message, status) VALUES (5, 5, 5, 'Movie despite should condition relate style somebody.', 'delivered');
