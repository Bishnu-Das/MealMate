import pool from "../db.js";
import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    vehicle_type,
    current_location,
    is_available = true,
  } = req.body;

  try {
    // Check if rider already exists
    const rider = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role_id = 'rider'",
      [email]
    );

    if (rider.rows.length !== 0) {
      return res.status(409).json({ message: "Rider already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into users table
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, phone_number, role_id)
       VALUES ($1, $2, $3, $4, 'rider') RETURNING *`,
      [name, email, hashedPassword, phone_number]
    );

    const userId = newUser.rows[0].user_id;

    // Insert into rider_profiles table
    const new_rider = await pool.query(
      `INSERT INTO rider_profiles (user_id, vehicle_type, current_location, is_available)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, vehicle_type, current_location, is_available]
    );

    // Generate token and respond
    generateToken(userId, res);

    res.status(201).json({
      message: "Rider registered successfully",
      user_id: userId,
      rider_id: new_rider.rows[0].rider_id,
      name: newUser.rows[0].name,
      email: newUser.rows[0].email,
      phone_number: newUser.rows[0].phone_number,
      vehicle_type,
      current_location,
      is_available,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the rider exists with role_id = 'rider'
    const rider = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role_id = 'rider'",
      [email]
    );

    if (rider.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Rider not found. Check your email." });
    }

    // 2. Compare passwords
    const validPassword = await bcrypt.compare(
      password,
      rider.rows[0].password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userId = rider.rows[0].user_id;

    // 3. Fetch rider profile info
    const profile = await pool.query(
      "SELECT vehicle_type, current_location, is_available FROM rider_profiles WHERE user_id = $1",
      [userId]
    );

    // 4. Generate JWT and set cookie
    generateToken(userId, res);

    // 5. Return rider info
    res.status(200).json({
      message: "Login successful",
      user_id: userId,
      rider_id: profile.rows[0].rider_id,
      name: rider.rows[0].name,
      email: rider.rows[0].email,
      phone_number: rider.rows[0].phone_number,
      vehicle_type: profile.rows[0]?.vehicle_type,
      current_location: profile.rows[0]?.current_location,
      is_available: profile.rows[0]?.is_available,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
};
