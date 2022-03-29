import express from "express";
import dotenv from "dotenv";
import { setupModels } from "./models";
import { usersRouter, dbRouter, diaryItemsRouter } from "./routes";
import { errorHandler } from "./middlewares";

dotenv.config();
setupModels();

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/diary-items", diaryItemsRouter);
app.use("/db", dbRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mental Diary API listening on http://localhost:${PORT}`);
});
