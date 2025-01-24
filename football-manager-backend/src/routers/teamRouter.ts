import express from "express";
import { authenticateToken } from "../middleware/authenticaToken";
import {
  getTeamAndPlayers,
  updateTeamName,
  getPlayersByPosition,
  setPlayerInMarket,
  showPlayerInMarket,
} from "../controllers/teamController";

const router = express.Router();

router.get("/", authenticateToken, getTeamAndPlayers);
router.put("/update-name", authenticateToken, updateTeamName);
router.get("/players-by-position", authenticateToken, getPlayersByPosition);
router.get("/set-player-transfer", authenticateToken, setPlayerInMarket);
router.get("/player-in-marketplace", authenticateToken, showPlayerInMarket);

export default router;
