import { User } from "../models";
import { UserDto } from "../models/Dtos";
import { NotFoundError } from "../errors";
import { SyncOptions } from "sequelize/types";
import { DatabaseService } from "../services";

class UserRepository {
  toDto = (dbUser: User): Omit<UserDto, "hashed_password"> => ({
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
    diaryItems: dbUser.diaryItems,
  });

  add = async (user: Omit<UserDto, "id">) => {
    const item = User.build(user);
    const dbUser = await item.save();
    return this.toDto(dbUser);
  };

  update = async (id: number, user: UserDto) => {
    const dbItem = await User.findByPk(id);
    if (dbItem === null) {
      throw new NotFoundError(`User with id ${id} was not found`);
    }
    return await dbItem.update(user);
  };

  delete = async (id: number) => {
    const deleteCount = await User.destroy({
      where: {
        id: id,
      },
    });
    if (deleteCount <= 0) {
      throw new NotFoundError(`User with id ${id} was not found`);
    }
  };

  get = async (id: number) => {
    return await User.findByPk(id);
  };
  
  findByUsername = async (username: string) => {
    return await User.findOne({where: {
      username: username
    }});
  };

  getAll = async () => {
    return await User.findAll();
  };

  sync = async (options?: SyncOptions) => {
    const db = await DatabaseService.getInstance();
    return await db.sequelize?.sync(options);
  };
}

const userRepository = new UserRepository();

export default userRepository;
