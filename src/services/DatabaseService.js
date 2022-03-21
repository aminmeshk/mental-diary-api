import { Sequelize } from "sequelize";

class DatabaseService {
  connect = async () => {
    const sequelize = new Sequelize(
      "postgres://postgres:666676@localhost:5432/mental-diary"
    );

    
    try {
      await sequelize.authenticate();
      console.log("Connection has been established sucessfully.");
      this.sequelize = sequelize;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };
}

const databaseService = new DatabaseService();
await databaseService.connect();

export default databaseService;
