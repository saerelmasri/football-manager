import { Request, RequestHandler, Response } from "express";
import { Team } from "../models/teamModel";
import { Player } from "../models/playerModel";
import { Transfer } from "../models/transferModel";

// @ts-ignore
export const getTeamAndPlayers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const team = await Team.findOne({
      where: { userId: userId },
      include: [{ model: Player, as: "players" }],
    });

    if (!team) {
      return res.status(400).json({
        message: "Team not found",
      });
    }

    console.log("team", team);

    return res.status(200).json({
      message: "Tean and players successfully fetched",
      team,
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// @ts-ignore
export const updateTeamName: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { teamName } = req.body;

    if (!teamName || teamName.trim() === "") {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.findOne({
      where: { userId: userId },
    });

    if (!team) {
      return res.status(400).json({
        message: "Team not found",
      });
    }

    team.name = teamName.trim();
    await team.save();

    return res.status(200).json({
      message: "Team updated successfully",
      team: {
        id: team.id,
        name: team.name,
        budget: team.budget,
      },
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// @ts-ignore
export const getPlayersByPosition: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { position } = req.body;

    if (
      !position ||
      !["GoalKeeper", "Defender", "Midfielder", "Attacker"].includes(
        position as string
      )
    ) {
      return res.status(400).json({ message: "Invalid or missing position" });
    }

    const team = await Team.findOne({
      where: { userId: userId },
    });

    if (!team) {
      return res.status(400).json({
        message: "Team not found",
      });
    }

    const players = await Player.findAll({
      where: { teamId: team.id, position },
      attributes: ["id", "name", "position", "transferListed"],
    });

    return res.status(200).json({
      message: "Players fetched successfully",
      players,
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// @ts-ignore
export const setPlayerInMarket: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { playerId, askingPrice } = req.body;

    if (!playerId || !askingPrice) {
      return res.status(400).json({
        message: "Player ID and asking price are required",
      });
    }

    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const team = await Team.findByPk(player.teamId);
    if (!team || team.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to list this player for transfer",
      });
    }

    const existingTransfer = await Transfer.findOne({
      where: { playerId },
    });
    if (existingTransfer) {
      return res.status(400).json({
        message: "Player is already listed in the transfer market",
      });
    }

    player.transferListed = true;
    await player.save();

    const transfer = await Transfer.create({
      playerId: playerId,
      askingPrice: askingPrice,
    });
    return res.status(201).json({
      message: "Player listed in the transfer market successfully",
      transfer,
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// @ts-ignore
export const showPlayerInMarket: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const team = await Team.findOne({ where: { userId: userId } });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const players = await Player.findAll({
      where: { transferListed: true, teamId: team.id },
    });
    if (players.length === 0) {
      return res.status(404).json({ message: "Players not found" });
    }

    return res.status(201).json({
      message: "Player listed in the transfer market",
      players,
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
