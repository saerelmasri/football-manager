import express from "express";
import { authenticateToken } from "../middleware/authenticaToken";
import {
  getTeamAndPlayers,
  updateTeamName,
  getPlayersByPosition,
  setPlayerInMarket,
  showPlayerInMarket,
  setLineUp,
} from "../controllers/teamController";

const router = express.Router();

router.get("/", authenticateToken, getTeamAndPlayers);
router.put("/update-name", authenticateToken, updateTeamName);
router.get("/players-by-position", authenticateToken, getPlayersByPosition);
router.put("/set-player-transfer", authenticateToken, setPlayerInMarket);
router.put("/set-player-lineup", authenticateToken, setLineUp);
router.get("/player-in-marketplace", authenticateToken, showPlayerInMarket);

export default router;
