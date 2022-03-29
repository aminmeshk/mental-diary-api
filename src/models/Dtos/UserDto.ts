import { DiaryItem } from "../DiaryItem";

export type UserDto = {
  id: number;
  username: string;
  hashed_password: string;
  email: string;
  diaryItems?: DiaryItem[];
};
