import express from "express";
import dotenv from "dotenv";
import SSLCommerzPayment from "sslcommerz-lts";
import cors from "cors";
import http from "http"; // Import http module
import { initSocket, getIO } from "./socket.js"; // Import initSocket and getIO
import customerAuthRoute from "./routes/customerRoute.js";
import customerRestaurantRoutes from "./customer/restaurant/restaurantRoutes.js";
import customerCartRoutes from "./customer/cart/cartRoutes.js";
import router from "./rider/riderRoutes.js";
import { router as restaurantRoute } from "./routes/restaurantRoute.js";
import menuRoutes from "./menu-management/menuRoutes.js"; // Import the menu routes
import cookieParser from "cookie-parser";
import riderAuthRoute from "./routes/riderAuthRoute.js";
import customerOrderRoutes from "./customer/order/orderRoutes.js";
import createCustomerPaymentRoutes from "./customer/payment/paymentRoutes.js";
import reviewRoutes from "./review_rating/reviewRoutes.js";
import chatRoutes from "./chats/chatRoutes.js";
import restaurantOrder from "./restaurants/order/orderRoutes.js";
import restaurnatStat from "./restaurants/stats/statsRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Initialize Socket.IO
const io = initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend's address
    credentials: true,
  })
);

// Register routes
console.log("Registering customer authentication routes...");
app.use("/api/customer", customerAuthRoute);
console.log("Registering customer restaurant routes...");
app.use("/api/customer", customerRestaurantRoutes);
console.log("Registering customer cart routes...");
app.use("/api/customer", customerCartRoutes);
console.log("Registering rider routes...");
app.use("/api/rider", riderAuthRoute);
app.use("/api/rider/data", router);
console.log("Registering restaurant routes...");
app.use("/api/restaurant", restaurantRoute);
console.log("Registering menu routes...");
app.use("/api/menu", menuRoutes); // Register the menu routes
console.log("Registering customer order routes...");
app.use("/api/customer/order", customerOrderRoutes);
console.log("Registering customer payment routes...");
const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
console.log("Loaded SSLCommerz Store ID:", store_id);
console.log("Loaded SSLCommerz Store Password:", store_passwd);
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
app.use("/api/customer/payment", customerPaymentRoutes);
console.log("Registering review routes...");
app.use("/api/customer/review", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/restaurant", restaurantOrder); //restaurant order management

app.use("/api/restaurant/stats", restaurnatStat); // for fetching restaurnant statistics

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend HTTP server is running on port: ${PORT}`);
});

export { io }; // Export the io instance
