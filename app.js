import express from "express";
import cors from "cors";
import "express-async-errors";
import itemsRouter from "./routes/items.js";
import usersRouter from "./routes/users.js";
import notificationRouter from "./routes/notifications.js";
import { CustomAPIError } from "./errors/custom-error.js";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MIDDLEWARE
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is Running!");
});
app.use("/api/v1/item", itemsRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/notification", notificationRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({
    message: "Something Went Wrong!!",
  });
});

// SERVER
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running in port ${port}`));
