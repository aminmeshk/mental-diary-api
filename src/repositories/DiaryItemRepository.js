import { NotFoundError } from "../errors/index.js";
import { DiaryItem } from "../models/index.js";

class DiaryItemRepository {
  /**
   *
   * @param {DiaryItem} diaryItem
   * @returns {Promise<DiaryItem>}
   */
  add = async (diaryItem) => {
    const { id, ...otherProps } = diaryItem;
    const item = DiaryItem.build(otherProps);
    return await item.save();
  };

  /**
   *
   * @param {number} id
   * @param {DiaryItem} diaryItem
   * @returns {Promise<DiaryItem>}
   */
  update = async (id, diaryItem) => {
    const dbItem = await DiaryItem.findByPk(id);
    if (dbItem === null) {
      throw new NotFoundError(`DiaryItem with id ${id} was not found`);
      // const err = new Error(`DiaryItem with id ${id} was not found`);
    }
    const { id: pulledId, ...otherProps } = diaryItem;
    return await dbItem.update(otherProps);
  };

  /**
   *
   * @param {number} id
   */
  delete = async (id) => {
    const deleteCount = await DiaryItem.destroy({
      where: {
        id: id,
      },
    });
    if (deleteCount <= 0) {
      throw new NotFoundError(`DiaryItem with id ${id} was not found`);
      // const err = new Error(`DiaryItem with id ${id} was not found`);
    }
  };

  /**
   *
   * @param {number} id
   * @returns {Promise<DiaryItem>}
   */
  get = async (id) => {
    return await DiaryItem.findByPk(id);
  };

  /**
   *
   * @param {number} id
   * @returns {Promise<DiaryItem[]>}
   */
  getAll = async () => {
    return await DiaryItem.findAll({
      order: [["timestamp", "ASC"]],
    });
  };
}

const diaryItemRepository = new DiaryItemRepository();

export default diaryItemRepository;
