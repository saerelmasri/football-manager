import express from "express";
import { authenticateToken } from "../middleware/authenticaToken";
import {
  getTeamAndPlayers,
  updateTeamName,
  setPlayerInMarket,
  setLineUp,
  removePlayerFromMarket,
} from "../controllers/teamController";

const router = express.Router();

router.get("/", authenticateToken, getTeamAndPlayers);
router.put("/update-name", authenticateToken, updateTeamName);
router.put("/set-player-transfer", authenticateToken, setPlayerInMarket);
router.put("/remove-player-market", authenticateToken, removePlayerFromMarket);
router.put("/set-player-lineup", authenticateToken, setLineUp);

export default router;
