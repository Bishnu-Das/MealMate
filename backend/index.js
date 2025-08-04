import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import http module
import { initSocket, getIO } from "./socket.js"; // Import initSocket and getIO
import cookieParser from "cookie-parser";
import reviewRoutes from "./review_rating/reviewRoutes.js";
import chatRoutes from "./chats/chatRoutes.js";
import restaurantRoute from "./restaurants/restaurant.route.js";
import customerRoute from "./customer/customer.route.js";

import riderRoute from "./rider/rider.route.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.0.101:5173"], // Change this to your frontend's address
    credentials: true,
  })
);

// const store_id = process.env.SSL_COMMERZ_STORE_ID;
// const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;

// if (!store_id || !store_passwd) {
//   console.error(
//     "ERROR: SSLCommerz store_id or store_passwd is missing. Check your .env file."
//   );
//   process.exit(1);
// }

// const customerPaymentRoutes = createCustomerPaymentRoutes(
//   store_id,
//   store_passwd
// );
app.use("/api/rider", riderRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/customer/review", reviewRoutes);
app.use("/api/customer", customerRoute);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend HTTP server is running on port: ${PORT}`);
});

export { io }; // Export the io instance
