import express from "express";
import { authenticateToken } from "../middleware/authenticaToken";
import {
  buyPlayer,
  filterTransfer,
} from "../controllers/transferController";

const router = express.Router();

router.get("/filter-players", authenticateToken, filterTransfer);
router.post("/buy-player", authenticateToken, buyPlayer);

export default router;
