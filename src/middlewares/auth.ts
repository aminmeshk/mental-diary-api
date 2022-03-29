import { RequestHandler } from "express";
import { JwtUserPayload } from "../models";
import { AuthService } from "../services";

export const tokenHandler: RequestHandler = (req, res, next) => {
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
  AuthService.verifyToken(token)
    .then((userPayload) => {
      if (!userPayload || !userPayload.username) {
        res.status(401).json({ error: "Invalid authorization token" });
        return;
      }
      (req as unknown as { user: JwtUserPayload }).user = userPayload;
      next();
    })
    .catch(next);
};
