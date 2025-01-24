import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/dbConfig";
import bcrypt from "bcryptjs";
import { User } from "./userModel";

export class Team extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public budget!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Team.init(
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
      unique: true
    },
    budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 5000000.0
    }
  },
  {
    sequelize,
    modelName: "Team",
    tableName: "teams",
    timestamps: true
  }
);

Team.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

User.hasOne(Team, {
    foreignKey: "userId",
    onDelete: "CASCADE"
})
