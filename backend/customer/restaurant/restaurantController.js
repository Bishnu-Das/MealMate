import pool from "../../db.js";

export const getNearbyRestaurants = async (req, res) => {
  try {
    const id = req.user.id;
    const radius = 5; // 5km

    // Get customer's primary location
    const userLocationResult = await pool.query(
      "SELECT latitude, longitude FROM user_locations WHERE user_id = $1 AND is_primary = true",
      [id]
    );

    if (userLocationResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Primary location not found for user." });
    }
    const userLat = userLocationResult.rows[0].latitude;
    const userLon = userLocationResult.rows[0].longitude;

    const query = `
      SELECT 
        r.restaurant_id, r.name, r.phone, r.email, r.average_rating, r.image_url,
        get_distance_km(rl.longitude, rl.latitude, $1, $2) AS distance
      FROM restaurants r
      JOIN user_locations rl ON r.restaurant_id = rl.restaurant_id
      WHERE get_distance_km(rl.longitude, rl.latitude, $1, $2) <= $3
      ORDER BY distance
      LIMIT 60
    `;

    let result = await pool.query(query, [userLon, userLat, radius]);

    // If no restaurants found in 5km, try 10km
    if (result.rows.length === 0) {
      const radius2 = 10; // 10km
      result = await pool.query(query, [userLon, userLat, radius2]);
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in getNearbyRestaurants:", err.message);
    res.status(500).json({ message: "Internal server error" });
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
export const getRestaurantsSearchByName = async (req, res) => {
  const rest_name = req.query.name;

  //console.log(rest_name);
  try {
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE name ILIKE $1 LIMIT 30`,
      [`%${rest_name.trim()}%`]
    );
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
      `SELECT 
        mi.*, 
        mi.created_at, 
        mc.name as category_name, 
        mc.menu_category_image_url, 
        COALESCE((
          SELECT CAST(SUM(oi.quantity) AS INTEGER) 
          FROM order_items oi 
          WHERE oi.menu_item_id = mi.menu_item_id), 0) as order_count 
        FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.category_id 
        WHERE mc.restaurant_id = $1 AND mi.is_active = true`,
      [id]
    );

    const restaurantQuery = `
    SELECT
      r.restaurant_id,
      r.name AS restaurant_name,
      r.phone,
      r.email,
      r.average_rating,
      r.image_url,
      r.descriptions,
      l.street,
      l.city,
      l.postal_code
    FROM restaurants r
    LEFT JOIN user_locations l ON r.restaurant_id = l.restaurant_id
    WHERE r.restaurant_id = $1
  `;
    const restaurantRes = await pool.query(restaurantQuery, [id]);
    if (restaurantRes.rowCount === 0) throw new Error("Restaurant not found");
    const r = restaurantRes.rows[0];

    const address = [r.street, r.city, r.postal_code]
      .filter(Boolean)
      .join(", ");

    const hoursQuery = `
    SELECT day_of_week, open_time, close_time
    FROM restaurant_hours
    WHERE restaurant_id = $1
    ORDER BY
      CASE
        WHEN day_of_week = 'Mon' THEN 1
        WHEN day_of_week = 'Tue' THEN 2
        WHEN day_of_week = 'Wed' THEN 3
        WHEN day_of_week = 'Thu' THEN 4
        WHEN day_of_week = 'Fri' THEN 5
        WHEN day_of_week = 'Sat' THEN 6
        WHEN day_of_week = 'Sun' THEN 7
        ELSE 8
      END
  `;
    const hoursRes = await pool.query(hoursQuery, [id]);

    res.json({
      restaruntDetails: {
        name: r.restaurant_name,
        descriptions: r.descriptions,
        restaurant_id: r.restaurant_id,
        // cuisine_type and description are not in your schema, so omit them
        phone: r.phone,
        email: r.email,
        rating: r.average_rating,
        reviewCount: 0,
        deliveryTime: 0,
        deliveryFee: 0,
        image: r.image_url,
        address,
        // delivery_settings is not in your schema, so omit or set as empty/default
        delivery_settings: {
          delivery_fee: "",
          min_order: "",
          delivery_time: "",
          delivery_radius: "",
        },
        operating_hours: hoursRes.rows.map((h) => ({
          day_of_week: h.day_of_week,
          open_time: h.open_time,
          close_time: h.close_time,
        })),
      },
      menuItems: menuItems.rows,
    });
  } catch (err) {
    console.error("Error in get getRestaurnt:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
  // const { id } = req.params;
  // try {
  //   const restaurantQuery = `
  //   SELECT
  //     r.restaurant_id,
  //     r.name AS restaurant_name,
  //     r.phone,
  //     r.email,
  //     r.average_rating,
  //     r.image_url,
  //     l.street,
  //     l.city,
  //     l.postal_code
  //   FROM restaurants r
  //   LEFT JOIN user_locations l ON r.restaurant_id = l.restaurant_id
  //   WHERE r.restaurant_id = $1
  // `;
  //   const restaurantRes = await pool.query(restaurantQuery, [id]);
  //   if (restaurantRes.rowCount === 0) throw new Error("Restaurant not found");
  //   const r = restaurantRes.rows[0];

  //   // 2. Compose address string
  //   const address = [r.street, r.city, r.postal_code]
  //     .filter(Boolean)
  //     .join(", ");

  //   // 3. Get operating hours
  //   const hoursQuery = `
  //   SELECT day_of_week, open_time, close_time
  //   FROM restaurant_hours
  //   WHERE restaurant_id = $1
  //   ORDER BY
  //     CASE
  //       WHEN day_of_week = 'Mon' THEN 1
  //       WHEN day_of_week = 'Tue' THEN 2
  //       WHEN day_of_week = 'Wed' THEN 3
  //       WHEN day_of_week = 'Thu' THEN 4
  //       WHEN day_of_week = 'Fri' THEN 5
  //       WHEN day_of_week = 'Sat' THEN 6
  //       WHEN day_of_week = 'Sun' THEN 7
  //       ELSE 8
  //     END
  // `;
  //   const hoursRes = await pool.query(hoursQuery, [id]);

  //   // 4. Compose frontend object
  //   const backendData = {
  //     name: r.restaurant_name,
  //     // cuisine_type and description are not in your schema, so omit them
  //     phone: r.phone,
  //     email: r.email,
  //     rating: r.average_rating,
  //     reviewCount: 0,
  //     deliveryTime: 0,
  //     deliveryFee: 0,
  //     image: r.image_url,
  //     address,
  //     // delivery_settings is not in your schema, so omit or set as empty/default
  //     delivery_settings: {
  //       delivery_fee: "",
  //       min_order: "",
  //       delivery_time: "",
  //       delivery_radius: "",
  //     },
  //     operating_hours: hoursRes.rows.map((h) => ({
  //       day_of_week: h.day_of_week,
  //       open_time: h.open_time,
  //       close_time: h.close_time,
  //     })),
  //   };
  //   console.log(backendData);
  //   res.json(backendData);
  // } catch (err) {
  //   console.log("error in getting restaurant details in pubic");
  //   res.status(500).json({ message: "internal server error" });
  // }
};

export const getRestaurantByLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const userLat = latitude;
    const userLon = longitude;

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
      LIMIT 50
    `;

    let result = await pool.query(query, [userLon, userLat, radius]);

    // If no restaurants found in 5km, try 10km
    if (result.rows.length === 0) {
      const radius2 = 10000; // 10km
      result = await pool.query(query, [userLon, userLat, radius2]);
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in getNearbyRestaurants:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviewsAll = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const reviews = await pool.query(
      `
      SELECT 
        r.review_id,
        r.rating, 
        r.comment, 
        r.created_at, 
        u.name AS user_name,
        mi.name AS menu_item_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN orders o ON o.order_id = r.order_id
      LEFT JOIN menu_items mi ON mi.menu_item_id = r.menu_item_id
      WHERE r.restaurant_id = $1
      ORDER BY r.created_at DESC
      `,
      [restaurantId]
    );

    res.status(200).json(reviews.rows);
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
