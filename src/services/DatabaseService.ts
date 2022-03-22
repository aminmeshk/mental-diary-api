import { Sequelize } from "sequelize";

class DatabaseService {
  sequelize: Sequelize | null;
  private static instance: DatabaseService;

  private constructor() {
    this.sequelize = null;
  }

  connect = async () => {
    const seq = new Sequelize(
      "postgres://postgres:666676@localhost:5432/mental-diary"
    );

    try {
      await seq.authenticate();
      console.log("Connection has been established sucessfully.");
      this.sequelize = seq;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };
  static getInstance = async () => {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      await DatabaseService.instance.connect();
    }
    return DatabaseService.instance;
  };
}

export default DatabaseService;
