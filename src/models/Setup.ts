import { Sequelize } from "sequelize/types";
import { DatabaseService } from "../services";
import { DiaryItem, initDiaryItem } from "./DiaryItem";
import { initUser, User } from "./User";

const initDbService = async () => {
  const dbService = await DatabaseService.getInstance();
  if (!dbService.sequelize) {
    throw new Error("Sequelize failed to connect");
  }
  return dbService;
};

const setupAssociations = () => {
  DiaryItem.belongsTo(User);
  User.hasMany(DiaryItem);
};

export const setupModels = async () => {
  const dbService = await initDbService();
  const sequelize = dbService.sequelize as Sequelize;
  initDiaryItem(sequelize);
  initUser(sequelize);
  setupAssociations();
};
