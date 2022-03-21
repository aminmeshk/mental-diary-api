import { Model, DataTypes } from "sequelize";
import { DatabaseService } from "../services/index.js";

class DiaryItem extends Model {}

DiaryItem.init({
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
}, {
    sequelize: DatabaseService.sequelize,
    modelName: 'DiaryItem',
});

export default DiaryItem;
