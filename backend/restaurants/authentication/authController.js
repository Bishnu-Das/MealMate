// import pool from "../db.js";
// import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";
import pool from "../../db.js";
import { generateToken } from "../../utils/jwtGenerator.js";

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
