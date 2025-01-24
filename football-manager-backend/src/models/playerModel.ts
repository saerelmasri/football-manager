import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/dbConfig";
import { Team } from "./teamModel";

export class Player extends Model {
  public id!: number;
  public teamId!: number;
  public name!: string;
  public position!: string;
  public transferListed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Player.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.ENUM("GoalKeeper", "Defender", "Midfielder", "Attacker"),
      allowNull: false,
    },
    transferListed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Player",
    tableName: "players",
    timestamps: true,
  }
);

Player.belongsTo(Team, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

Team.hasMany(Player, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
  as: "players"
});
