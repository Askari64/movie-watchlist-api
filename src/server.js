import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

//Import Routes
import movieRoutes from "./routes/movieRoutes.js";

connectDB();

const PORT = 5000;
const app = express();

// API Routes
app.use("/movies", movieRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", async (error) => {
  console.error(`Unhandled Rejection: ${error}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Handle Uncaught Exceptions
process.on("uncaughtException", async (error) => {
  console.error(`Unhandled Exception: ${error}`);
  await disconnectDB();
  process.exit(1);
});

// Graceful Shutdown

process.on("SIGTERM", async () => {
  console.log("Terminate Signal recieved. Shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
