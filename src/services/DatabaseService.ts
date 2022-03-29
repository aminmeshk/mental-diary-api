import { Sequelize } from "sequelize";

class DatabaseService {
  sequelize: Sequelize | null;
  private static instance: DatabaseService;

  private constructor() {
    this.sequelize = null;
  }

  connect = async (retries = 5) => {
    const seq = new Sequelize(
      "postgres://postgres:666676@localhost:5432/mental-diary"
    );

    while (retries > 0) {
      try {
        await seq.authenticate();
        console.log("Connection has been established sucessfully.");
        this.sequelize = seq;
        return;
      } catch (error) {
        console.error(`Trying to connect to the database, ${retries} retries left`, error);
        retries -= 1;
        await new Promise(res => setTimeout(res, 3000));
      }
      console.error("Unable to connect to the database");
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
