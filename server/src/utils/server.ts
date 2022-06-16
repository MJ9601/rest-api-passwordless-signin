import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "config";
import cookieParser from "cookie-parser";

const server = () => {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  return app;
};

export default server;
