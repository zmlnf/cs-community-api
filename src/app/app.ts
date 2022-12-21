import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { expressjwt as jwt, UnauthorizedError } from "express-jwt";
import cors from "cors";
import response from "./response.js";
import config from "./config.js";
import "./database.js";

const app = express();

app.use(express.json());

app.use(
  jwt({
    secret: config.SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }).unless({
    path: ["/api/user/login"],
  })
);

app.use(
  (
    error: UnauthorizedError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error.name === "UnauthorizedError") {
      res.status(401).send(response.AuthFailed());
    }
    next();
  }
);

app.use(cors());

export default app;
