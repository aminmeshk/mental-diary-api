import express from "express";
import { DiaryItemRepository } from "../repositories";
import { tokenHandler } from "../middlewares";
import { JwtUserPayload } from "../models";

const router = express.Router();

router.use(tokenHandler);

router.get("/", (req, res, next) => {
  const userId = (req as unknown as { user: JwtUserPayload }).user.userId;
  DiaryItemRepository.getAllByUserId(userId)
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const userId = (req as unknown as { user: JwtUserPayload }).user.userId;
  DiaryItemRepository.add({ ...req.body, UserId: userId })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

router.put("/:id", (req, res, next) => {
  DiaryItemRepository.update(parseInt(req.params.id), req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  DiaryItemRepository.delete(parseInt(req.params.id))
    .then(() => {
      res.status(200).json();
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
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

export default router;
