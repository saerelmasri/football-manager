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
export const removePlayerFromMarket: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        message: "Player ID are required",
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

    if (!existingTransfer) {
      return res.status(400).json({
        message: "Player is not listed in the transfer market",
      });
    }

    player.transferListed = false;
    await player.save();

    await existingTransfer.destroy();

    return res.status(201).json({
      message: "Player removed from the transfer market successfully",
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
export const setLineUp: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { playerId, isStarting } = req.body;

    if (!playerId || typeof isStarting !== "boolean") {
      return res.status(400).json({
        message: "Invalid request. 'playerId' and 'isStarting' are required, and 'isStarting' must be a boolean.",
      });
    }

    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const team = await Team.findByPk(player.teamId);
    if (!team || team.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to change the lineup of this player",
      });
    }

    player.isStarting = isStarting;
    await player.save();

    return res.status(201).json({
      message: "Player update in line up successfully",
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
