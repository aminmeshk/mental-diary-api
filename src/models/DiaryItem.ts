import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User";

export class DiaryItem extends Model {
  declare id: number;
  declare timestamp: Date;
  declare description?: string;
  declare pleasure?: number;
  declare skill?: number;
  declare avoiding?: boolean;
  declare userId: number;
  declare User?: User;
}

export const initDiaryItem = (sequelize: Sequelize) =>
  DiaryItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      pleasure: {
        type: DataTypes.DOUBLE,
      },
      skill: {
        type: DataTypes.DOUBLE,
      },
      avoiding: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize: sequelize,
      modelName: "DiaryItem",
    }
  );
