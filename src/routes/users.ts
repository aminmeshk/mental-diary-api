import express from "express";
import { UserRepository } from "../repositories";
import { tokenHandler } from "../middlewares";
import { LoginRequest, SignupRequest } from "../models";
import { AuthService } from "../services";

const router = express.Router();

router.get("/", tokenHandler, (req, res, next) => {
  UserRepository.getAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  AuthService.createUser(req.body as SignupRequest)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(next);
});

router.post("/login", (req, res, next) => {
  AuthService.verifyPassword(req.body as LoginRequest)
    .then((userDto) => {
      if (!userDto) {
        res.status(401).json({ error: "Username or Password is incorrect" });
        return;
      }

      AuthService.createToken(userDto.id, userDto.username)
        .then((token) => {
          res.json({ access_token: token });
        })
        .catch(next);
    })
    .catch(next);
});

export default router;
