import express from "express";
import { authenticateToken } from "../middleware/authenticaToken";
import {
  buyPlayer,
  displayAllPlayers,
  filterTransfer,
} from "../controllers/transferController";

const router = express.Router();

router.get("/", authenticateToken, displayAllPlayers);
router.get("/filter-players", authenticateToken, filterTransfer);
router.get("/buy-player", authenticateToken, buyPlayer);

export default router;
