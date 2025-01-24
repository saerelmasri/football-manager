import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/dbConfig";
import { Player } from "./playerModel";

export class Transfer extends Model {
  public id!: number;
  public playerId!: string;
  public askingPrice!: number;
  public readonly createdAt!: Date;
}

Transfer.init(
  { 
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    askingPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: "Transfer",
    tableName: "transferMarket",
    timestamps: true,
  }
);

Transfer.belongsTo(Player, {
  foreignKey: "playerId",
  onDelete: "CASCADE",
});

Player.hasOne(Transfer, {
  foreignKey: "playerId",
  onDelete: "CASCADE",
});
