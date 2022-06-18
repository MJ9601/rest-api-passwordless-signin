import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { accTokenOptions } from "../controllers/session.controller";
import { reIssueNewAccToken } from "../services/session.service";
import { verifyJwt } from "../utils/jwt.utils";
import logger from "../utils/loggor";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "cookies.accessToken");
  const refreshToken = get(req, "cookies.refreshToken");

  const { decoded, expired } = verifyJwt({
    token: accessToken,
    isAccToken: true,
  });

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueNewAccToken(refreshToken);
    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, accTokenOptions);

      const results = verifyJwt({
        token: newAccessToken as string,
        isAccToken: true,
      });
      res.locals.user = results.decoded;

      return next();
    }
  }

  return next();
};

export default deserializeUser;
