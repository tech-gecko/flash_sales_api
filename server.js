import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connect } from "mongoose";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import initializeSaleSystem from "./src/services/saleMonitor.js";
import authRoutes from "./src/routes/authRoutes.js";
import salesRoutes from "./src/routes/salesRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";
import routeNotFound from "./src/middleware/routeNotFound.js";
import rateLimit from "express-rate-limit";

config();

const app = express();
const server = createServer(app);
const io = new Server(server);
const { connection } = mongoose;

// Attach io to app
app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const rateLimitConfig = {
  windowMs: 60 * 1000,
  max: 10, // Max requests per windowMs
  message: "Too many requests from this IP, please try again later"
};

const limiter = rateLimit(rateLimitConfig);
app.use(limiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/flashsales", salesRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);

// Health check
app.get("/", (_, res) => {
  return res.status(200).json({ 
    status: "OK",
    timestamp: new Date(),
    dbState: connection.readyState 
  });
});

app.use(routeNotFound);

app.use((err, req, res, _) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: {
      type: err.name,
      message: err.message || "Internal server error"
    }
  };
  
  if (err.name === "SaleNotActiveError") {
    errorResponse.error.details = "The sale is either not started or already completed.";
  } else if (err.name === "InsufficientStockError") {
    errorResponse.error.details = "Insufficient stock. Try reducing your purchase quantity.";
  }

  res.status(statusCode).json(errorResponse);
});

connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
    initializeSaleSystem();
  })
  .catch(err => console.error(err));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
