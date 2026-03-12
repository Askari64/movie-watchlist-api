import express from "express";
import {
  addMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMovies);

router.post("/add", addMovie);

router.patch("/:id", updateMovie);

router.delete("/:id", deleteMovie);

export default router;
