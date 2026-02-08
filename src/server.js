import express from "express";

//Import Routes
import movieRoutes from './routes/movieRoutes.js'

const PORT = 5000;
const app = express();

// API Routes
app.use("/movies", movieRoutes)

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
