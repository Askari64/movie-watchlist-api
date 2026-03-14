import express from "express";
import {
  addToWatchlist,
  deleteFromWatchlist,
  getWatchlistItems,
  updateWatchlistItem,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addAndUpdateToWatchlistSchema } from "../validators/watchlistValidator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addAndUpdateToWatchlistSchema), addToWatchlist);

router.patch("/:id", validateRequest(addAndUpdateToWatchlistSchema), updateWatchlistItem);

router.delete("/:id", deleteFromWatchlist);

router.get("/", getWatchlistItems);

export default router;
