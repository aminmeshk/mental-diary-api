import { DataTypes, Model, Sequelize } from "sequelize";
import { DiaryItem } from "./DiaryItem";

export class User extends Model {
  declare id: number;
  declare username: string;
  declare hashed_password: string;
  declare email: string;
  declare diaryItems?: DiaryItem[];
}

export const initUser = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hashed_password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize: sequelize,
      modelName: "User",
    }
  );
