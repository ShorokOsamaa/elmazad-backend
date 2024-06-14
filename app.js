import express from "express";
import cors from "cors";
import "express-async-errors";
import itemsRouter from "./routes/items.js";
import usersRouter from "./routes/users.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// Routes
app.get("/", (req, res) => {
  res.send("Server is Running!");
});
app.use("/api/v1/item", itemsRouter);
app.use("/api/v1/user", usersRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something Went Wrong!!",
  });
});

// SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in port ${port}`));
