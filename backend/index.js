import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import http module
import { Server } from "socket.io"; // Import Server from socket.io
import customerRoute from "./routes/customerRoute.js";

import restaurantRoute from "./routes/restaurantRoute.js";
import menuRoutes from "./menu-management/menuRoutes.js"; // Import the menu routes
import riderAuthRoute from "./routes/riderAuthRoute.js";
import riderRoutes from "./rider/riderRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend's address
    credentials: true,
  })
);

// Register routes
console.log("Registering customer routes...");
app.use("/api/customer", customerRoute);
console.log("Registering rider routes...");
app.use("/api/rider", riderAuthRoute);
app.use("/api/rider/data", riderRoutes);
console.log("Registering restaurant routes...");
app.use("/api/restaurant", restaurantRoute);
console.log("Registering menu routes...");
app.use("/api/menu", menuRoutes); // Register the menu routes


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});

export { io }; // Export the io instance
