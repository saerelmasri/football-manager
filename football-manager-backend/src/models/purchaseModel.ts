import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/dbConfig";
import { Player } from "./playerModel";
import { Team } from "./teamModel";

export class Purchase extends Model {
  public id!: number;
  public buyerTeamId!: string;
  public sellerTeamId!: string;
  public playerId!: string;
  public price!: number;
  public readonly purchaseDate!: Date;
}

Purchase.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Purchase",
    tableName: "purchases",
    timestamps: true,
  }
);

Purchase.belongsTo(Player, {
  foreignKey: "playerId",
  onDelete: "CASCADE",
});

Purchase.belongsTo(Team, {
  foreignKey: "buyerTeamId",
  as: "buyerTeam",
  onDelete: "CASCADE",
});

Purchase.belongsTo(Team, {
  foreignKey: "sellerTeamId",
  as: "sellerTeam",
  onDelete: "CASCADE",
});
