import mongoose from "mongoose";
import config from "config";
import logger from "./loggor";

const dbConn = async () => {
  const dbUri = config.get<string>("mongodbUri");

  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to db ...");
  } catch (err) {
    logger.error("Couldn't connect to db!");
    process.exit(1);
  }
};

export default dbConn;
