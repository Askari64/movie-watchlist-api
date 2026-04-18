import express from "express";
import {
  addMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  updateMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addAndUpdateMovieSchema } from "../validators/movieValidator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMovies);

router.get("/:id", getMovieById)

router.post("/add", validateRequest(addAndUpdateMovieSchema), addMovie);

router.patch("/:id", validateRequest(addAndUpdateMovieSchema), updateMovie);

router.delete("/:id", deleteMovie);

export default router;
