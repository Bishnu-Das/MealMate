import pool from "../../db.js";
import bcrypt from "bcrypt";
import cloudinary from "../../utils/cloudinary.js";
import fs from "fs";

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
      r.image_url,
      r.average_rating AS rating,
      r.phone,
      r.descriptions as description,
      r.cuisine_type,
      r.email,
      l.street,
      l.city,
      l.postal_code,
      l.longitude,
      l.latitude
    FROM restaurants r
    LEFT JOIN user_locations l ON r.restaurant_id = l.restaurant_id
    WHERE r.restaurant_id = $1
  `;
  const restaurantRes = await pool.query(restaurantQuery, [restaurant_id]);
  if (restaurantRes.rowCount === 0) throw new Error("Restaurant not found");
  const r = restaurantRes.rows[0];

  // 2. Compose address string
  //const address = [r.street, r.city, r.postal_code].filter(Boolean).join(", ");

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
    street: r.street,
    city: r.city,
    postal_code: r.postal_code,
    latitude: r.latitude,
    longitude: r.longitude,
    // delivery_settings is not in your schema, so omit or set as empty/default
    restaurant_image: r.image_url,
    rating: r.rating,
    description: r.description,
    cuisine_type: r.cuisine_type,
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

  // Extract fields from body (flat fields because it's multipart/form-data)
  const {
    restaurant_name,
    phone,
    email,
    cuisine_type,
    description,
    delivery_fee,
    min_order,
    delivery_time,
    delivery_radius,
    operating_hours: operatingHoursRaw,
    latitude,
    longitude,
    street,
    city,
    postal_code,
  } = req.body;

  let operating_hours = [];
  try {
    if (operatingHoursRaw) {
      operating_hours = JSON.parse(operatingHoursRaw);
    }
  } catch (err) {
    console.warn("Invalid JSON for operating_hours");
    return res.status(400).json({ message: "Invalid operating_hours format" });
  }

  try {
    // Step 1: Get current image URL from DB
    const oldData = await pool.query(
      "SELECT image_url FROM restaurants WHERE restaurant_id = $1",
      [restaurant_id]
    );

    let imageUrl = oldData.rows[0]?.image_url || null;

    // Step 2: Handle new image upload
    if (req.file) {
      if (imageUrl) {
        const parts = imageUrl.split("/");
        const filenameWithExt = parts[parts.length - 1];
        const publicId = `restaurant_profile/${filenameWithExt.split(".")[0]}`;

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Image deletion failed:", err.message);
        }
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "restaurant_profile",
      });
      imageUrl = uploaded.secure_url;
      fs.unlinkSync(req.file.path); // remove local temp file
    }

    // Step 3: Update restaurant basic info
    await pool.query(
      `UPDATE restaurants 
       SET name = $1, phone = $2, image_url = $3, email = $4, cuisine_type = $5, descriptionS = $6 
       WHERE restaurant_id = $7`,
      [
        restaurant_name,
        phone,
        imageUrl,
        email,
        cuisine_type,
        description,
        restaurant_id,
      ]
    );

    // Step 4: Update address (user_locations table)
    if (street || city || postal_code || latitude || longitude) {
      const locRes = await pool.query(
        "SELECT location_id FROM user_locations WHERE restaurant_id = $1",
        [restaurant_id]
      );

      if (locRes.rows.length > 0) {
        const location_id = locRes.rows[0].location_id;
        await pool.query(
          "UPDATE user_locations SET street = $1, city = $2, postal_code = $3, latitude=$4, longitude=$5 WHERE location_id = $6",
          [street, city, postal_code, latitude, longitude, location_id]
        );
      } else {
        await pool.query(
          "INSERT INTO user_locations (restaurant_id, street, city, postal_code,latitude,longitude) VALUES ($1, $2, $3, $4,$5,$6)",
          [restaurant_id, street, city, postal_code, latitude, longitude]
        );
      }
    }

    // // Step 5: Update delivery_settings table
    // const delivRes = await pool.query(
    //   "SELECT restaurant_id FROM delivery_settings WHERE restaurant_id = $1",
    //   [restaurant_id]
    // );

    // if (delivRes.rows.length > 0) {
    //   await pool.query(
    //     `UPDATE delivery_settings
    //      SET delivery_fee = $1, min_order = $2, delivery_time = $3, delivery_radius = $4
    //      WHERE restaurant_id = $5`,
    //     [delivery_fee, min_order, delivery_time, delivery_radius, restaurant_id]
    //   );
    // } else {
    //   await pool.query(
    //     `INSERT INTO delivery_settings
    //      (restaurant_id, delivery_fee, min_order, delivery_time, delivery_radius)
    //      VALUES ($1, $2, $3, $4, $5)`,
    //     [restaurant_id, delivery_fee, min_order, delivery_time, delivery_radius]
    //   );
    // }

    // Step 6: Upsert operating hours
    if (Array.isArray(operating_hours) && operating_hours.length > 0) {
      await pool.query("SELECT upsert_restaurant_hours($1, $2::jsonb)", [
        restaurant_id,
        JSON.stringify(operating_hours),
      ]);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      image_url: imageUrl,
    });
  } catch (err) {
    console.error("Error in editProfile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
