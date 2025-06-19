import pool from "../db.js";
import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { name, phone, email, location_id, average_rating, password } =
      req.body;
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
      "INSERT INTO restaurants (name,phone,email,location_id,average_rating,password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, phone, email, location_id, average_rating, hashedPassword]
    );
    generateToken(newRestaurant.rows[0].restaurant_id, res);
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
    generateToken(restaurant_id, res);
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
