import express, { ErrorRequestHandler, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NotFoundError } from "./errors";
import { DiaryItemRepository, UserRepository } from "./repositories";
import { setupModels } from "./models";
import { DatabaseService } from "./services";

dotenv.config();
setupModels();

const app = express();
const PORT = 3001;

app.use(express.json());

const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader &&
    authHeader.split(" ") &&
    authHeader.split(" ").length == 2 &&
    authHeader.split(" ")[1];
  if (!token || token.length === 0) {
    res.status(401).json({ error: "Invalid authorization token" });
    return;
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.status(401).json({ error: err.message });
        return;
      }
      (req as any).user = (decoded as any).user;
      next();
    }
  );
};

app.post("/login", (req, res) => {
  const username = req.body.username as string;
  const user = { username: username };
  const payload = { user: user };

  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, (err, token) => {
    if (err) {
      throw err;
    }
    res.json({ access_token: token });
  });
});

app.get("/diary-item", verifyToken, (req, res, next) => {
  DiaryItemRepository.getAll()
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

app.get("/diary-item/:id", verifyToken, (req, res, next) => {
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

app.post("/diary-item", verifyToken, (req, res, next) => {
  DiaryItemRepository.add(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

app.post("/sync", verifyToken, (req, res, next) => {
  DatabaseService.getInstance().then((db) =>
    db.sequelize
      ?.sync({ alter: true })
      .then((result) => {
        res.status(200).json();
      })
      .catch(next)
  );
});

app.put("/diary-item/:id", verifyToken, (req, res, next) => {
  DiaryItemRepository.update(parseInt(req.params.id), req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

app.delete("/diary-item/:id", verifyToken, (req, res, next) => {
  DiaryItemRepository.delete(parseInt(req.params.id))
    .then(() => {
      res.status(200).json();
    })
    .catch(next);
});

app.get("/users", verifyToken, (req, res, next) => {
  UserRepository.getAll()
    .then((result) => {
      res.status(200).json(result);
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
