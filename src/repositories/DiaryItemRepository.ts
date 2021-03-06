import { DiaryItem } from "../models";
import { DiaryItemDto } from "../models/Dtos";
import { NotFoundError } from "../errors";
import { SyncOptions } from "sequelize/types";

class DiaryItemRepository {
  add = async (diaryItem: DiaryItemDto) => {
    const item = DiaryItem.build(diaryItem);
    return await item.save();
  };

  update = async (id: number, diaryItem: DiaryItemDto) => {
    const dbItem = await DiaryItem.findByPk(id);
    if (dbItem === null) {
      throw new NotFoundError(`DiaryItem with id ${id} was not found`);
    }
    return await dbItem.update(diaryItem);
  };

  delete = async (id: number) => {
    const deleteCount = await DiaryItem.destroy({
      where: {
        id: id,
      },
    });
    if (deleteCount <= 0) {
      throw new NotFoundError(`DiaryItem with id ${id} was not found`);
    }
  };

  get = async (id: number) => {
    return await DiaryItem.findByPk(id);
  };

  getAll = async () => {
    return await DiaryItem.findAll({
      order: [["timestamp", "ASC"]],
    });
  };

  getAllByUserId = async (userId: number) => {
    return await DiaryItem.findAll({
      where: {
        UserId: userId,
      },
      order: [["timestamp", "ASC"]],
    });
  };

  sync = async (options?: SyncOptions) => {
    return await DiaryItem.sync(options);
  };
}

const diaryItemRepository = new DiaryItemRepository();

export default diaryItemRepository;
