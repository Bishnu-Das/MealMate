import pool from "../db.js";

export const get_menu = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await pool.query(
      "SELECT M.MENU_ITEM_ID,M.CATEGORY_ID,M.NAME,M.DESCRIPTION,M.PRICE,M.IS_AVAILABLE,M.MENU_ITEM_IMAGE_URL,M.DISCOUNT,C.NAME AS CATEGORY_NAME,C.MENU_CATEGORY_IMAGE_URL AS CATEGORY_IMAGE FROM MENU_ITEMS M JOIN MENU_CATEGORIES C ON (M.CATEGORY_ID = C.CATEGORY_ID) WHERE C.RESTAURANT_ID = $1 AND M.is_active = true",
      [id]
    );

    // Map over all rows to format each menu item
    const data = item.rows.map((row) => ({
      id: row.menu_item_id,
      name: row.name,
      price: row.price,
      image: row.menu_item_image_url,
      rating: row.average_rating, // Only if this column exists in your query
      isAvailable: row.is_available,
      discount: row.discount,
      category: row.category_name,
      description: row.description,
      categoryImage: row.category_image, // Optional: add category image if needed
    }));

    res.json(data);
  } catch (err) {
    console.log("Error in get_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const get_cetegories = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await pool.query(
      "SELECT * FROM MENU_CATEGORIES WHERE restaurant_id = $1",
      [id]
    );
    const data = item.rows.map((row) => row.name);
    res.json(data);
  } catch (err) {
    console.log("Error in get categories controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const get_restaurant_details = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantQuery = `
    SELECT 
      r.restaurant_id,
      r.name AS restaurant_name,
      r.phone,
      r.email,
      r.average_rating,
      r.image_url,
      l.street,
      l.city,
      l.postal_code
    FROM restaurants r
    LEFT JOIN user_locations l ON r.location_id = l.location_id
    WHERE r.restaurant_id = $1
  `;
    const restaurantRes = await pool.query(restaurantQuery, [id]);
    if (restaurantRes.rowCount === 0) throw new Error("Restaurant not found");
    const r = restaurantRes.rows[0];

    // 2. Compose address string
    const address = [r.street, r.city, r.postal_code]
      .filter(Boolean)
      .join(", ");

    // 3. Get operating hours
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

    // 4. Compose frontend object
    const backendData = {
      name: r.restaurant_name,
      // cuisine_type and description are not in your schema, so omit them
      phone: r.phone,
      email: r.email,
      rating: r.average_rating,
      reviewCount: 0,
      deliveryTime: 0,
      deliveryFee: 0,
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
    };
    console.log(backendData);
    res.json(backendData);
  } catch (err) {
    console.log("error in getting restaurant details in pubic");
    res.status(500).json({ message: "internal server error" });
  }
};

export const get_restaurant_by_name = async (req, res) => {
  const name = req.name;
  try {
    const rest = await pool.query("SELECT * FROM restaurants WHERE name = $1", [
      name,
    ]);
    res.json(res.rows);
  } catch (err) {
    console.log("error in getting restaurant search by name");
    res.status(500).json({ message: "internal server error" });
  }
};
