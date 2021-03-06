const {
  PORT,
  ORIGIN,
  MONGODB_URI,
  ACCESS_TOKEN_PUB_KEY,
  ACCESS_TOKEN_PRI_KEY,
  REFRESH_TOKEN_PUB_KEY,
  REFRESH_TOKEN_PRI_KEY,
  SMTP_USER,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_HOST,
  SMTP_SECURE,
  SERVER_ENDPOINT,
} = process.env;

export default {
  serverEndpoint: SERVER_ENDPOINT || "http://localhost:8080",
  port: PORT || "8080",
  origin: ORIGIN || "http://localhost:3000",
  mongodbUri: MONGODB_URI || "mongodb://127.0.0.1:27017/passwordlessAuth",
  accTokenTimeToLive: "15m",
  refTokenTimeToLive: "1y",
  accTokenPriKey: ACCESS_TOKEN_PRI_KEY,
  accTokenPubKey: ACCESS_TOKEN_PUB_KEY,
  refTokenPriKey: REFRESH_TOKEN_PRI_KEY,
  refTokenPubKey: REFRESH_TOKEN_PUB_KEY,
  smtp: {
    user: SMTP_USER || "ydkyg4roh2x27frm@ethereal.email",
    pass: SMTP_PASS || "4ATC1UuUJCdUTH3WGD",
    host: SMTP_HOST || "smtp.ethereal.email",
    port: Number(SMTP_PORT) || 587,
    secure: Boolean(SMTP_SECURE) || false,
  },
};
