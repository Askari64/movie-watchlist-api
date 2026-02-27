import express from "express";
import {
  addMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getMovies);

router.post("/add", authMiddleware, addMovie);

router.put("/:id", updateMovie);

router.delete("/:id", authMiddleware, deleteMovie);

export default router;
