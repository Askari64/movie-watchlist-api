import express from "express";
import { addToWatchlist, deleteFromWatchlist, updateWatchlistItem } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/",addToWatchlist )

router.put("/:id", updateWatchlistItem)

router.delete("/:id", deleteFromWatchlist)

export default router;
