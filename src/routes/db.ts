import express from "express";
import { tokenHandler } from "../middlewares";
import { DatabaseService } from "../services";

const router = express.Router();

router.use(tokenHandler);

router.post("/sync", tokenHandler, (req, res, next) => {
    DatabaseService.getInstance().then((db) =>
      db.sequelize
        ?.sync({ alter: true })
        .then((result) => {
          res.status(200).json();
        })
        .catch(next)
    );
  });


export default router;
