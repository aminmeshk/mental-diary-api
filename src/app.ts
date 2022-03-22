import express, { ErrorRequestHandler } from "express";
import { NotFoundError } from "./errors";
import { DiaryItemRepository } from "./repositories";
const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/diary-item", (req, res, next) => {
  DiaryItemRepository.getAll()
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

app.get("/diary-item/:id", (req, res, next) => {
  if (!req.params.id) {
    res.status(400).json({ error: `id parameter cannot be null` });
    return;
  }
  const idInteger = parseInt(req.params.id);

  if (isNaN(idInteger)) {
    res.status(400).json({ error: `id parameter must be a number` });
    return;
  }
  DiaryItemRepository.get(idInteger)
    .then((result) => {
      if (result === null) {
        res
          .status(404)
          .json({ error: `DiaryItem with id ${idInteger} was not found` });
        return;
      }
      res.status(200).json(result);
    })
    .catch(next);
});

app.post("/diary-item", (req, res, next) => {
  DiaryItemRepository.add(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

app.put("/diary-item/:id", (req, res, next) => {
  DiaryItemRepository.update(parseInt(req.params.id), req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

app.delete("/diary-item/:id", (req, res, next) => {
  DiaryItemRepository.delete(parseInt(req.params.id))
    .then(() => {
      res.status(200).json();
    })
    .catch(next);
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error("Request ended with error: ", err);
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message });
  }
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});
