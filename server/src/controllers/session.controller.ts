import { CookieOptions, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get, omit } from "lodash";
import {
  ChangeUserPassSchema,
  VerifyUserWithLinkSchema,
} from "../schemas/user.schema";
import { createSession } from "../services/session.service";
import { findOneUserAndUpdate, findUser } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/loggor";
import timeValidation from "../utils/timeValidation";
import config from "config";

export const accTokenOptions: CookieOptions = {
  maxAge: 9e5, //15 min,
  httpOnly: true,
  domain: "localhost",
  sameSite: "strict",
  path: "/",
  secure: false,
};
export const refTokenOptions: CookieOptions = {
  ...accTokenOptions,
  maxAge: 3.154e10, //1 year
};

export const verifyUserEmailHandler = async (
  req: Request<{}, {}, {}, VerifyUserWithLinkSchema>,
  res: Response
) => {
  const { userId, verifyCode } = req.query;
  try {
    const [randomId, creationDate] = verifyCode.split("-D");
    const isNotExpired = timeValidation(new Date(Number(creationDate)), 24);
    if (!isNotExpired)
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("Verification code is Expired!");

    const user = await findUser({ _id: userId });

    if (verifyCode !== user?.validationCode)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .send("Invalid Verify Code!");

    const updatedUser = (
      await findOneUserAndUpdate(
        { _id: userId },
        { profileVerified: true, $set: { validationCode: null } },
        { new: true }
      )
    )?.toJSON();
    if (!updatedUser)
      return res
        .status(StatusCodes.INSUFFICIENT_STORAGE)
        .send("Something went wrong!");

    const newSession = await createSession(
      updatedUser._id,
      get(req, "user-agent") || ""
    );

    const tokenPayload = {
      ...omit(updatedUser, ["password", "validationCode"]),
      session: newSession._id,
    };

    const accessToken = signJwt({
      tokenPayload,
      isAccToken: true,
      options: { expiresIn: config.get("accTokenTimeToLive") },
    });

    const refreshToken = signJwt({
      tokenPayload,
      isAccToken: false,
      options: { expiresIn: config.get("refTokenTimeToLive") },
    });

    res.cookie("accessToken", accessToken, accTokenOptions);
    res.cookie("refreshToken", refreshToken, refTokenOptions);
    return res.status(StatusCodes.ACCEPTED).send({ accessToken, refreshToken });
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// login with password;

export const createSessionHandler = async (req: Request, res: Response) => {};

// logout

export const deleteSessionHandler = async (req: Request, res: Response) => {};

export const updateUserPassHandler = async (
  req: Request<
    {},
    {},
    Omit<ChangeUserPassSchema["body"], "confirmPassword">,
    {}
  >,
  res: Response
) => {
  const { newPassword } = req.body;
  try {
    const updatedUser = await findOneUserAndUpdate(
      { _id: res.locals.user },
      { $set: { password: newPassword } },
      { new: true }
    );
    return res.status(StatusCodes.ACCEPTED).send("Email has been verified!");
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
