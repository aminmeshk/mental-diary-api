import { Model, DataTypes, Sequelize } from "sequelize";
import { DatabaseService } from "../services";

class DiaryItem extends Model {
  declare id: number;
  declare timestamp: Date;
  declare description?: string;
  declare pleasure?: number;
  declare skill?: number;
  declare avoiding?: boolean;
}

const initDiaryItem = async (sequelize: Sequelize) =>
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

DatabaseService.getInstance().then((dbService) => {
  if (!dbService.sequelize) {
    throw new Error('Sequelize failed to connect');
  }
  initDiaryItem(dbService.sequelize);
});

export default DiaryItem;
