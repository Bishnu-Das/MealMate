import pool from "../../db.js";
import cloudinary from "../../utils/cloudinary.js";
import fs from "fs";

export const add_menu = async (req, res) => {
  const id = req.user.id;
  const { category, name, description, price, is_available, discount } =
    req.body;

  if (!category || category.trim() === "") {
    return res.status(400).json({ message: "Category name is required" });
  }
  //console.log(req.body);
  try {
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "restaurant_menu_items",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Delete temp file after upload
    }
    if (!imageUrl) {
      imageUrl =
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop";
    }

    let categoryResult = await pool.query(
      `SELECT * FROM menu_categories WHERE restaurant_id = $1 AND name = $2`,
      [id, category]
    );

    if (categoryResult.rows.length === 0) {
      categoryResult = await pool.query(
        `INSERT INTO menu_categories (restaurant_id, name) VALUES($1, $2) RETURNING *`,
        [id, category.trim()]
      );
    }

    const category_id = categoryResult.rows[0].category_id;

    const discountValue = discount === "" ? null : discount;

    const newItem = await pool.query(
      `INSERT INTO menu_items 
      (category_id, name, description, price, is_available, discount, menu_item_image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        category_id,
        name,
        description,
        price,
        is_available,
        discountValue,
        imageUrl,
      ]
    );
    if (newItem.rows.length > 0) {
      const item2 = await pool.query(
        "SELECT M.MENU_ITEM_ID,M.CATEGORY_ID,M.NAME,M.DESCRIPTION,M.PRICE,M.IS_AVAILABLE,M.MENU_ITEM_IMAGE_URL,M.DISCOUNT,C.NAME AS CATEGORY_NAME,C.MENU_CATEGORY_IMAGE_URL AS CATEGORY_IMAGE FROM MENU_ITEMS M JOIN MENU_CATEGORIES C ON (M.CATEGORY_ID = C.CATEGORY_ID) WHERE M.menu_item_id = $1",
        [newItem.rows[0].menu_item_id]
      );
      res.status(201).json({
        message: "Menu item added successfully",
        item: item2.rows[0],
      });
    } else {
      res.status(400).json({ message: "Menu item not added" });
    }
  } catch (err) {
    console.error("Error in add_menu controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const edit_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  const menu_item_id = req.params.menu_item_id;

  const {
    name,
    description,
    price,
    is_available,
    discount,
    category,
    menu_item_image_url, // this is for fallback if no new image
  } = req.body;

  if (!category || category.trim() === "") {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    // Step 1: Check if the menu item exists and belongs to this restaurant
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

    let imageUrl = menu_item_image_url;

    // Step 2: Handle image upload if new file provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      const oldImageUrl = itemCheck.rows[0].menu_item_image_url;
      if (oldImageUrl) {
        const parts = oldImageUrl.split("/");
        const publicIdWithExt = parts[parts.length - 1]; // e.g., abc123.jpg
        const publicId = `restaurant_menu_items/${
          publicIdWithExt.split(".")[0]
        }`;

        await cloudinary.uploader.destroy(publicId).catch(() => {
          console.warn("Previous image deletion failed or skipped.");
        });
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "restaurant_menu_items",
      });
      imageUrl = result.secure_url;
      //console.log(imageUrl);

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    // Step 3: Check or create category
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

    // Step 4: Perform the update
    const updatedItem = await pool.query(
      `UPDATE menu_items
       SET name = $1,
           description = $2,
           price = $3,
           is_available = $4,
           discount = $5,
           category_id = $6,
           menu_item_image_url = $7
       WHERE menu_item_id = $8
       RETURNING *`,
      [
        name,
        description,
        price,
        is_available,
        discount || null,
        category_id,
        imageUrl,
        menu_item_id,
      ]
    );

    res.status(200).json({
      status: "success",
      message: "Menu item updated successfully",
      item: updatedItem.rows[0],
    });
  } catch (err) {
    console.error("Error in edit_menu controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const change_menu_availability = async (req, res) => {
  const restaurant_id = req.user.id;
  const menu_item_id = req.params.menu_item_id;
  const { status } = req.body;

  try {
    // Make sure this item belongs to the authenticated restaurant
    const itemCheck = await pool.query(
      `SELECT mi.* FROM menu_items mi
       JOIN menu_categories mc ON mi.category_id = mc.category_id
       WHERE mi.menu_item_id = $1 AND mc.restaurant_id = $2`,
      [menu_item_id, restaurant_id]
    );

    if (itemCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Menu item not found or unauthorized" });
    }

    // Update availability status
    const updateRes = await pool.query(
      `UPDATE menu_items SET is_available = $1 WHERE menu_item_id = $2 RETURNING *`,
      [status, menu_item_id]
    );

    return res.status(200).json({
      message: "Menu item availability updated",
      updatedItem: updateRes.rows[0],
    });
  } catch (err) {
    console.error("Error in change_menu_availability:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const delete_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  const { menu_item_id } = req.params;
  console.log(restaurant_id, menu_item_id);

  try {
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
    const update = await pool.query(
      "UPDATE menu_items set is_active = false WHERE menu_item_id = $1 returning *",
      [menu_item_id]
    );
    console.log(update.rows);
    res
      .status(200)
      .json({ status: "success", message: "Menu item deleted successfully" });
  } catch (err) {
    console.log("Error in delete_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }

  // try {
  //   // Verify the item belongs to this restaurant
  //   const itemCheck = await pool.query(
  //     `SELECT mi.* FROM menu_items mi
  //      JOIN menu_categories mc ON mi.category_id = mc.category_id
  //      WHERE mi.menu_item_id = $1 AND mc.restaurant_id = $2`,
  //     [menu_item_id, restaurant_id]
  //   );

  //   if (itemCheck.rows.length === 0) {
  //     return res
  //       .status(404)
  //       .json({ message: "Menu item not found or not authorized" });
  //   }

  //   const imageUrl = itemCheck.rows[0].menu_item_image_url;

  //   if (imageUrl) {
  //     const publicIdMatch = imageUrl.match(
  //       /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/
  //     );
  //     const publicId = publicIdMatch?.[1];

  //     if (publicId) {
  //       await cloudinary.uploader.destroy(publicId);
  //     }
  //   }

  //   await pool.query(`DELETE FROM menu_items WHERE menu_item_id = $1`, [
  //     menu_item_id,
  //   ]);

  //   res
  //     .status(200)
  //     .json({ status: "success", message: "Menu item deleted successfully" });
  // } catch (err) {
  //   console.log("Error in delete_menu controller", err.message);
  //   res.status(500).json({ message: "internal server error" });
  // }
};

export const get_menu = async (req, res) => {
  const restaurant_id = req.user.id;
  try {
    const item = await pool.query(
      `SELECT 
        M.MENU_ITEM_ID,
        M.CATEGORY_ID,
        M.NAME,M.DESCRIPTION,
        M.PRICE,M.IS_AVAILABLE,
        M.MENU_ITEM_IMAGE_URL,
        M.DISCOUNT,
        C.NAME AS CATEGORY_NAME,
        C.MENU_CATEGORY_IMAGE_URL AS CATEGORY_IMAGE 
      FROM MENU_ITEMS M 
      JOIN MENU_CATEGORIES C ON (M.CATEGORY_ID = C.CATEGORY_ID) 
      WHERE 
        C.RESTAURANT_ID = $1 AND M.is_active = true`,
      [restaurant_id]
    );
    //console.log(item.rows);
    res.json(item.rows);
  } catch (err) {
    console.log("Error in get_menu controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const get_menu_categories = async (req, res) => {
  const restaurant_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT name FROM menu_categories WHERE restaurant_id = $1",
      [restaurant_id]
    );

    // Extract names into a Set to remove duplicates
    const categorySet = new Set(result.rows.map((row) => row.name));

    // Convert Set back to array and prepend "All"
    const categoryNames = ["All", ...categorySet];

    res.json(categoryNames);
  } catch (err) {
    console.error("Error in get_categories:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
