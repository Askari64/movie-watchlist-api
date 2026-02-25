import express from "express";
import { addToWatchlist, deleteFromWatchlist, updateWatchlistItem } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidator.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/",validateRequest(addToWatchlistSchema), addToWatchlist )

router.put("/:id", updateWatchlistItem)

router.delete("/:id", deleteFromWatchlist)

export default router;
