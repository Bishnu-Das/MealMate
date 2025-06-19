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
    const newRestaurant = await pool.query(
      "INSERT INTO restaurants (name,phone,email,latitude, longitude,password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, phone, email, latitude, longitude, hashedPassword]
    );
    if (latitude !== null && longitude !== null) {
      await pool.query(
        "INSERT INTO user_locations (restaurant_id, latitude, longitude) VALUES ($1, $2, $3)",
        [newRestaurant.rows[0].restaurant_id, latitude, longitude]
      );
    }
    generateToken(newRestaurant.rows[0].restaurant_id, "restaurant", res);
    res.status(201).json({
      restaurant_id: newRestaurant.rows[0].restaurant_id,
      name: newRestaurant.rows[0].name,
      phone: newRestaurant.rows[0].phone,
      email: newRestaurant.rows[0].email,
      location_id: newRestaurant.rows[0].location_id,
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

export const add_menu = async (req, res) => {
  const id = req.user.id;
  console.log("restaurant id", id);
  const { category, name, description, price, is_available } = req.body;

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

    const newItem = await pool.query(
      `INSERT INTO menu_items (category_id, name, description, price, is_available)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [category_id, name, description, price, is_available]
    );

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
  const { name, description, price, is_available, category } = req.body;
  const menu_item_id = req.params.menu_item_id;
  console.log(menu_item_id, restaurant_id);
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
      [restaurant_id, category]
    );

    if (categoryResult.rows.length === 0) {
      categoryResult = await pool.query(
        `INSERT INTO menu_categories (restaurant_id, name) VALUES ($1, $2) RETURNING *`,
        [restaurant_id, category]
      );
    }

    const category_id = categoryResult.rows[0].category_id;

    const updatedItem = await pool.query(
      `UPDATE menu_items
       SET name = $1, description = $2, price = $3, is_available = $4, category_id = $5
       WHERE menu_item_id = $6
       RETURNING *`,
      [name, description, price, is_available, category_id, menu_item_id]
    );

    res.status(200).json({
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

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.log("Error in delete_menu controller", err.message);
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
