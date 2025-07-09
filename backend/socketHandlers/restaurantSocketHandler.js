import pool from "../db.js";
import { getIO } from "../socket.js";

export const handleRestaurantSocketEvents = (socket) => {
  socket.on("accept_order", async ({ orderId, restaurantId }) => {
    console.log(`Backend received accept_order for Order ID: ${orderId}, Restaurant ID: ${restaurantId}`);
    const io = getIO();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
        ["preparing", orderId]
      );

      if (orderResult.rows.length === 0) {
        await client.query("ROLLBACK");
        console.error(`Order ${orderId} not found for acceptance.`);
        return;
      }

      const order = orderResult.rows[0];

      // Emit order status updated event to the restaurant
      io.to(`restaurant_${restaurantId}`).emit("order_status_updated", order);
      // Also emit to the customer
      io.to(`customer_${order.customer_id}`).emit("order_status_updated", order);

      await client.query("COMMIT");
      console.log(`Order ${orderId} accepted by restaurant ${restaurantId}.`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error accepting order:", error);
    } finally {
      client.release();
    }
  });

  socket.on("reject_order", async ({ orderId, restaurantId }) => {
    const io = getIO();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
        ["restaurant_rejected", orderId]
      );

      if (orderResult.rows.length === 0) {
        await client.query("ROLLBACK");
        console.error(`Order ${orderId} not found for rejection.`);
        return;
      }

      const order = orderResult.rows[0];

      // Emit order status updated event to the restaurant
      io.to(`restaurant_${restaurantId}`).emit("order_status_updated", order);
      // Also emit to the customer
      io.to(`customer_${order.customer_id}`).emit("order_status_updated", order);

      await client.query("COMMIT");
      console.log(`Order ${orderId} rejected by restaurant ${restaurantId}.`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error rejecting order:", error);
    } finally {
      client.release();
    }
  });
};
