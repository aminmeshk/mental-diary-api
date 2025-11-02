import { Dialect, Sequelize } from "sequelize";
import ormconfig from '../../ormconfig.json';

class DatabaseService {
  sequelize: Sequelize | null;
  private static instance: DatabaseService;

  private constructor() {
    this.sequelize = null;
  }

  connect = async (retries = 5) => {
    const seq = new Sequelize(
      {
        dialect: ormconfig.type as Dialect,
        host: ormconfig.host,
        database: ormconfig.database,
        logging: ormconfig.logging ? console.log : false,
        username: ormconfig.username,
        password: ormconfig.password,
        port: ormconfig.port,
      }
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
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    console.error("Unable to connect to the database");
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
