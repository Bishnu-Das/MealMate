import express from "express";
import dotenv from "dotenv";
import SSLCommerzPayment from "sslcommerz-lts";
import cors from "cors";
import http from "http"; // Import http module
import { initSocket, getIO } from "./socket.js"; // Import initSocket and getIO
import cookieParser from "cookie-parser";

import createCustomerPaymentRoutes from "./customer/payment/paymentRoutes.js";
import reviewRoutes from "./review_rating/reviewRoutes.js";
import chatRoutes from "./chats/chatRoutes.js";

import restaurantRoute from "./restaurants/restaurant.route.js";
import customerRoute from "./customer/customer.route.js";

import riderRoute from "./rider/rider.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Initialize Socket.IO
const io = initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.0.101:5173"], // Change this to your frontend's address
    credentials: true,
  })
);

app.use("/api/rider", riderRoute);
app.use("/api/restaurant", restaurantRoute);

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;

if (!store_id || !store_passwd) {
  console.error(
    "ERROR: SSLCommerz store_id or store_passwd is missing. Check your .env file."
  );
  process.exit(1);
}

const customerPaymentRoutes = createCustomerPaymentRoutes(
  store_id,
  store_passwd
);

app.use("/api/customer/review", reviewRoutes);
app.use("/api/customer", customerRoute);

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend HTTP server is running on port: ${PORT}`);
});

export { io }; // Export the io instance
