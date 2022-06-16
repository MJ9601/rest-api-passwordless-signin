const {
  PORT,
  ORIGIN,
  MONGODB_URI,
  ACCESS_TOKEN_PUB_KEY,
  ACCESS_TOKEN_PRI_KEY,
  REFRESH_TOKEN_PUB_KEY,
  REFRESH_TOKEN_PRI_KEY,
} = process.env;
export default {
  port: PORT || "8080",
  origin: ORIGIN || "http://localhost:3000",
  mongodbUri: MONGODB_URI || "mongodb://127.0.0.1:27017/passwordlessAuth",
  accTokenTimeToLive: "15m",
  refTokenTimeToLive: "1y",
  accTokenPriKey: ACCESS_TOKEN_PRI_KEY,
  accTokenPubKey: ACCESS_TOKEN_PUB_KEY,
  refTokenPriKey: REFRESH_TOKEN_PRI_KEY,
  refTokenPubKey: REFRESH_TOKEN_PUB_KEY,
};
