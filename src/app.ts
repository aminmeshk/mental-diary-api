import express from "express";
import dotenv from "dotenv";
import { setupModels } from "./models";
import { usersRouter, dbRouter, diaryItemsRouter } from "./routes";
import { errorHandler } from "./middlewares";
import morgan from "morgan";
import { isProduction } from "./utils";

dotenv.config();
setupModels();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan(isProduction() ? 'tint' : 'dev'));
// app.use(morgan('dev'));

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.use("/users", usersRouter);
app.use("/diary-items", diaryItemsRouter);
app.use("/db", dbRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mental Diary API listening on http://localhost:${PORT}`);
});
