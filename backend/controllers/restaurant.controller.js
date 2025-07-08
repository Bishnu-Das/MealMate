import pool from "../db.js";
import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { name, phone, email, latitude, longitude, password } = req.body;

    const restaurant = await pool.query(
      "SELECT * FROM restaurants where email = $1",
      [email]
    );
    if (restaurant.rows.length !== 0) {
      return res.status(409).json({ message: "restaurant already exists" });
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create restaurant without location
    const newRestaurant = await pool.query(
      "INSERT INTO restaurants (name,phone,email,password) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, phone, email, hashedPassword]
    );
    const newRestaurantId = newRestaurant.rows[0].restaurant_id;

    // 2. Create location and get its ID
    let location_id = null;
    if (latitude !== null && longitude !== null) {
      const locationResult = await pool.query(
        "INSERT INTO user_locations (restaurant_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING location_id",
        [newRestaurantId, latitude, longitude]
      );
      location_id = locationResult.rows[0].location_id;

      // 3. Update restaurant with the new location_id
      await pool.query(
        "UPDATE restaurants SET location_id = $1 WHERE restaurant_id = $2",
        [location_id, newRestaurantId]
      );
    }

    generateToken(newRestaurantId, "restaurant", res);
    res.status(201).json({
      restaurant_id: newRestaurantId,
      name: newRestaurant.rows[0].name,
      phone: newRestaurant.rows[0].phone,
      email: newRestaurant.rows[0].email,
      location_id: location_id,
      average_rating: newRestaurant.rows[0].average_rating,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await pool.query(
      "SELECT * FROM restaurants WHERE email=$1",
      [email]
    );

    if (restaurant.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "user not found. check your email." });
    }
    const validpassword = await bcrypt.compare(
      password,
      restaurant.rows[0].password
    );
    if (!validpassword) {
      return res.status(401).json({ password: "invalid credentials" });
    }
    const restaurant_id = restaurant.rows[0].restaurant_id;
    generateToken(restaurant_id, "restaurant", res);
    res.status(200).json({
      message: "login successfull",
      restaurant_id: restaurant.rows[0].restaurant_id,
      name: restaurant.rows[0].name,
      phone: restaurant.rows[0].phone,
      email: restaurant.rows[0].email,
      location_id: restaurant.rows[0].location_id,
      average_rating: restaurant.rows[0].average_rating,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const varify = async (req, res) => {
  const id = req.user.id;
  try {
    const restaurant = await pool.query(
      "SELECT * FROM restaurants where restaurant_id=$1",
      [id]
    );
    res.status(200).json({
      restaurant_id: restaurant.rows[0].restaurant_id,
      name: restaurant.rows[0].name,
      phone: restaurant.rows[0].phone,
      email: restaurant.rows[0].email,
      location_id: restaurant.rows[0].location_id,
      average_rating: restaurant.rows[0].average_rating,
    });
  } catch (err) {
    console.log("Error in varify controller:", err.message);
    res.status(500).json({ message: "Internal server error in varify" });
  }
};

export const add_menu = async (req, res) => {
  const id = req.user.id;
  console.log("restaurant id", id);
  const { category, name, description, price, is_available, discount } =
    req.body;

  console.log(req.body);
  try {
    let categoryResult = await pool.query(
      `SELECT * FROM menu_categories WHERE restaurant_id = $1 AND name = $2`,
      [id, category]
    );

    // If category does not exist, insert it
    if (categoryResult.rows.length === 0) {
      categoryResult = await pool.query(
        `INSERT INTO menu_categories (restaurant_id, name) VALUES($1, $2) RETURNING *`,
        [id, category]
      );
    }

    const category_id = categoryResult.rows[0].category_id;

    const discountValue = discount === '' ? null : discount;

    const newItem = await pool.query(
      `INSERT INTO menu_items (category_id, name, description, price, is_available,discount)
       VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [category_id, name, description, price, is_available, discountValue]
    );
    console.log("done");

    if (newItem.rows.length > 0) {
      res.status(201).json({
        message: "Menu item added successfully",
        item: newItem.rows[0],
      });
    } else {
      res.status(400).json({ message: "Menu item not added" });
    }
  } catch (err) {
    console.log("Error in add_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const edit_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  //console.log("restaurant user id ", restaurant_id);
  const {
    name,
    description,
    price,
    is_available,
    category_name,
    menu_item_image_url,
  } = req.body;
  const menu_item_id = req.params.menu_item_id;
  //console.log("in edit menu controller", menu_item_id, restaurant_id);
  console.log(req.body);
  try {
    // Check if item exists and belongs to this restaurant
    const itemCheck = await pool.query(
      `SELECT mi.*, mc.restaurant_id FROM menu_items mi
       JOIN menu_categories mc ON mi.category_id = mc.category_id
       WHERE mi.menu_item_id = $1 AND mc.restaurant_id = $2`,
      [menu_item_id, restaurant_id]
    );

    if (itemCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Menu item not found or not authorized" });
    }

    // Update category if changed
    let categoryResult = await pool.query(
      `SELECT * FROM menu_categories WHERE restaurant_id = $1 AND name = $2`,
      [restaurant_id, category_name]
    );

    if (categoryResult.rows.length === 0) {
      categoryResult = await pool.query(
        `INSERT INTO menu_categories (restaurant_id, name) VALUES ($1, $2) RETURNING *`,
        [restaurant_id, category_name]
      );
    }

    const category_id = categoryResult.rows[0].category_id;

    const updatedItem = await pool.query(
      `UPDATE menu_items
       SET name = $1, description = $2, price = $3, is_available = $4, category_id = $5, menu_item_image_url=$6
       WHERE menu_item_id = $7
       RETURNING *`,
      [
        name,
        description,
        price,
        is_available,
        category_id,
        menu_item_image_url,
        menu_item_id,
      ]
    );

    res.status(200).json({
      status: "success",
      message: "Menu item updated successfully",
      item: updatedItem.rows[0],
    });
  } catch (err) {
    console.log("Error in edit_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const delete_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  const { menu_item_id } = req.params;
  console.log(restaurant_id, menu_item_id);

  try {
    // Verify the item belongs to this restaurant
    const itemCheck = await pool.query(
      `SELECT mi.* FROM menu_items mi
       JOIN menu_categories mc ON mi.category_id = mc.category_id
       WHERE mi.menu_item_id = $1 AND mc.restaurant_id = $2`,
      [menu_item_id, restaurant_id]
    );

    if (itemCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Menu item not found or not authorized" });
    }

    await pool.query(`DELETE FROM menu_items WHERE menu_item_id = $1`, [
      menu_item_id,
    ]);

    res
      .status(200)
      .json({ status: "success", message: "Menu item deleted successfully" });
  } catch (err) {
    console.log("Error in delete_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const get_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  try {
    const item = await pool.query(
      "SELECT M.MENU_ITEM_ID,M.CATEGORY_ID,M.NAME,M.DESCRIPTION,M.PRICE,M.IS_AVAILABLE,M.MENU_ITEM_IMAGE_URL,M.DISCOUNT,C.NAME AS CATEGORY_NAME,C.MENU_CATEGORY_IMAGE_URL AS CATEGORY_IMAGE FROM MENU_ITEMS M JOIN MENU_CATEGORIES C ON (M.CATEGORY_ID = C.CATEGORY_ID) WHERE C.RESTAURANT_ID = $1",
      [restaurant_id]
    );
    res.json(item.rows);
  } catch (err) {
    console.log("Error in get_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const id = req.user.id;
  const { prevPassword, newPassword } = req.body;
  try {
    const restaurant = await pool.query(
      "SELECT * FROM restaurants WHERE restaurant_id = $1",
      [id]
    );
    if (restaurant.rows.length === 0) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    const validpassword = await bcrypt.compare(
      prevPassword,
      restaurant.rows[0].password
    );
    if (!validpassword) {
      return res.status(401).json({ password: "invalid previous password" });
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.query(
      "UPDATE restaurants SET password = $1 WHERE restaurant_id = $2",
      [hashedPassword, id]
    );
    res.status(200).json({ message: "Password changed successfully.." });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error. in change password.." });
  }
};

export const getRestaurantProfile = async (req, res) => {
  // 1. Get restaurant basic info and location
  const restaurant_id = req.user.id;
  const restaurantQuery = `
    SELECT 
      r.restaurant_id,
      r.name AS restaurant_name,
      r.phone,
      r.email,
      l.street,
      l.city,
      l.postal_code
    FROM restaurants r
    LEFT JOIN user_locations l ON r.location_id = l.location_id
    WHERE r.restaurant_id = $1
  `;
  const restaurantRes = await pool.query(restaurantQuery, [restaurant_id]);
  if (restaurantRes.rowCount === 0) throw new Error("Restaurant not found");
  const r = restaurantRes.rows[0];

  // 2. Compose address string
  const address = [r.street, r.city, r.postal_code].filter(Boolean).join(", ");

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
  const hoursRes = await pool.query(hoursQuery, [restaurant_id]);

  // 4. Compose frontend object
  const backendData = {
    restaurant_name: r.restaurant_name,
    // cuisine_type and description are not in your schema, so omit them
    phone: r.phone,
    email: r.email,
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
  res.json(backendData);
  return backendData;
};

export const editProfile = async (req, res) => {
  const restaurant_id = req.user.id;
  const {
    restaurant_name,
    phone,
    address,
    delivery_settings,
    operating_hours,
  } = req.body;

  try {
    // 1. Update restaurant name and phone
    await pool.query(
      "UPDATE restaurants SET name = $1, phone = $2 WHERE restaurant_id = $3",
      [restaurant_name, phone, restaurant_id]
    );

    // 2. Update address (if you have a locations table)
    if (address) {
      const [street = "", city = "", postal_code = ""] = address
        .split(",")
        .map((s) => s.trim());
      const locRes = await pool.query(
        "SELECT location_id FROM user_locations WHERE restaurant_id = $1",
        [restaurant_id]
      );
      if (locRes.rows.length > 0) {
        const location_id = locRes.rows[0].location_id;
        await pool.query(
          "UPDATE user_locations SET street = $1, city = $2, postal_code = $3 WHERE location_id = $4",
          [street, city, postal_code, location_id]
        );
      }
    }

    // 3. Upsert operating hours using your PostgreSQL function
    if (Array.isArray(operating_hours)) {
      await pool.query("SELECT upsert_restaurant_hours($1, $2::jsonb)", [
        restaurant_id,
        JSON.stringify(operating_hours),
      ]);
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.log("Error in editProfile controller:", err.message);
    res.status(500).json({ message: "Internal server error in editProfile" });
  }
};