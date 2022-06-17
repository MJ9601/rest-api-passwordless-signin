import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "config";
import cookieParser from "cookie-parser";
import wrapRoutes from "../routes";

const server = () => {
  const app = express();
  app.use(express.json());

  app.use(cookieParser());
  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  app.use(wrapRoutes);

  return app;
};

export default server;
