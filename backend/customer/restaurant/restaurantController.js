import pool from "../../db.js";

export const getNearbyRestaurants = async (req, res) => {
  try {
    const id = req.user.id;
    const radius = 5000; // 5km

    // Get customer's primary location
    const userLocationResult = await pool.query(
      'SELECT latitude, longitude FROM user_locations WHERE user_id = $1 AND is_primary = true',
      [id]
    );

    if (userLocationResult.rows.length === 0) {
      return res.status(404).json({ message: 'Primary location not found for user.' });
    }
    const userLat = userLocationResult.rows[0].latitude;
    const userLon = userLocationResult.rows[0].longitude;

    const query = `
      SELECT 
        r.restaurant_id, r.name, r.phone, r.email, r.average_rating, r.image_url,
        ST_Distance(
          ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
          ST_MakePoint($1, $2)::GEOGRAPHY
        ) AS distance
      FROM restaurants r
      JOIN user_locations rl ON r.restaurant_id = rl.restaurant_id
      WHERE ST_DWithin(
        ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
        ST_MakePoint($1, $2)::GEOGRAPHY,
        $3
      )
      ORDER BY distance
      LIMIT 30
    `;

    let result = await pool.query(query, [userLon, userLat, radius]);

    // If no restaurants found in 5km, try 10km
    if (result.rows.length === 0) {
      const radius2 = 10000; // 10km
      result = await pool.query(query, [userLon, userLat, radius2]);
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in getNearbyRestaurants:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_categories LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenus = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_items LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenuItem = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items where menu_item_id = $1",
      [id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurant = async (req, res) => {
  const id = req.params.id;
  try {
    const resResult = await pool.query(
      "SELECT * FROM restaurants where restaurant_id=$1",
      [id]
    );
    const menuItems = await pool.query(
      "SELECT mi.menu_item_id,mi.category_id,mi.name as menu_name, mi.description, mi.price, mi.is_available, mi.menu_item_image_url,mc.restaurant_id, mc.name category_name, mc.menu_category_image_url FROM menu_items mi join menu_categories mc on (mi.category_id = mc.category_id) WHERE restaurant_id = $1",
      [id]
    );

    res.json({
      restaruntDetails: resResult.rows[0],
      menuItems: menuItems.rows,
    });
  } catch (err) {
    console.error("Error in get getRestaurnt:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};