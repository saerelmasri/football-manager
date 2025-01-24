import { Request, RequestHandler, Response } from "express";
import { Transfer } from "../models/transferModel";
import { Player } from "../models/playerModel";
import { Team } from "../models/teamModel";
import { Op } from "sequelize";

// @ts-ignore
export const displayAllPlayers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const transfers = await Transfer.findAll({
      include: [
        {
          model: Player,
          attributes: ["id", "name", "position"],
          include: [
            {
              model: Team,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      attributes: ["id", "askingPrice", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Transfer list retrieved successfully",
      transfers,
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
export const filterTransfer: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamName, playerName, position, minPrice, maxPrice } = req.query;

    const transfers = await Transfer.findAll({
      include: [
        {
          model: Player,
          attributes: ["id", "name", "position"],
          where: {
            ...(playerName ? { name: { [Op.like]: `%${playerName}%` } } : {}),
            ...(position ? { position: { [Op.like]: `%${position}%` } } : {}),
          },
          include: [
            {
              model: Team,
              attributes: ["id", "name"],
              where: teamName ? { name: { [Op.like]: `%${teamName}%` } } : {},
            },
          ],
        },
      ],
      where: {
        askingPrice: {
          [Op.between]: [minPrice || 0, maxPrice || Number.MAX_VALUE],
        },
      },
      attributes: ["id", "askingPrice", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Filtered transfer list retrieved successfully",
      transfers,
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
export const buyPlayer: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        message: "PlayerId is required",
      });
    }
    const transfer = await Transfer.findOne({
      where: { playerId },
      include: [
        {
          model: Player,
          attributes: ["id", "name"],
          include: [
            {
              model: Team,
              attributes: ["id", "userId"],
            },
          ],
        },
      ],
    });

    if (!transfer) {
      return res.status(400).json({ message: "Transfer not found" });
    }

    const player = await Player.findByPk(transfer.playerId);
    if (!player) {
      return res.status(400).json({ message: "Player not found " });
    }

    const sellerTeam = await Team.findByPk(player.teamId);
    if (!sellerTeam || sellerTeam.userId === userId) {
      return res.status(403).json({
        message: "You cannot buy your own player",
      });
    }

    const buyerTeam = await Team.findOne({ where: { userId } });
    if (!buyerTeam) {
      return res.status(404).json({ message: "Buyer team not found" });
    }

    const purchasePrice = transfer.askingPrice * 0.95;

    const buyerPlayerCount = await Player.count({
      where: { teamId: buyerTeam.id },
    });
    const sellerPlayerCount = await Player.count({
      where: { teamId: sellerTeam.id },
    });

    if (buyerPlayerCount >= 25) {
      return res.status(400).json({
        message: "Your team already has the maximum number of players (25)",
      });
    }

    if (sellerPlayerCount <= 15) {
      return res.status(400).json({
        message: "The seller's team cannot have less than 15 players",
      });
    }

    buyerTeam.budget -= transfer.askingPrice;
    sellerTeam.budget += transfer.askingPrice;

    await buyerTeam.save();
    await sellerTeam.save();

    player.teamId = buyerTeam.id;
    player.transferListed = false;

    await player.save();

    await transfer.destroy();

    return res.status(200).json({
      message: "Player purchased successfully",
      player,
      purchasePrice,
    });
  } catch (error) {
    console.log("errror:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
