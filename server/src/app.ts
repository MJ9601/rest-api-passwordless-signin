import "dotenv/config";
import server from "./utils/server";
import config from "config";
import logger from "./utils/loggor";
import dbConn from "./utils/dbConn";

const app = server();

const port = config.get("port");

app.listen(port, () => {
  logger.info(`Server is running on PORT ${port}`);
});

dbConn();
