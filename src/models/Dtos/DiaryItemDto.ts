export type DiaryItemDto = {
  id: number;
  timestamp: Date;
  description?: string;
  pleasure?: number;
  skill?: number;
  avoiding?: boolean;
};
