import { ErrorRequestHandler } from "express";
import { NotFoundError } from "../errors";
import { isProduction } from "../utils";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error("Request ended with error: ", err);
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    if (isProduction()) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
