import { CookieOptions, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get, omit } from "lodash";
import {
  ChangeUserPassSchema,
  VerifyUserWithLinkSchema,
} from "../schemas/user.schema";
import {
  createSession,
  findUserSessions,
  updateSession,
} from "../services/session.service";
import {
  findOneUserAndUpdate,
  findUser,
  validUserPassword,
} from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/loggor";
import timeValidation from "../utils/timeValidation";
import config from "config";
import { CreateSessionWithPassSchema } from "../schemas/session.schema";

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
      req.get("user-agent") || ""
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

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionWithPassSchema, {}>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const validUser = await validUserPassword({ email, password });
    if (!validUser)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("Invalid email or password!");

    const newSession = await createSession(
      validUser._id,
      req.get("user-agent") || ""
    );

    const tokenPayload = {
      ...omit(validUser, ["password", "validationCode"]),
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
  } catch (err) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// logout

export const deleteSessionHandler = async (req: Request, res: Response) => {
  try {
    const { _id: userId, session } = res.locals.user;

    await updateSession({ _id: session }, { $set: { valid: false } });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.sendStatus(StatusCodes.OK);
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  const { _id, session } = res.locals.user;
  try {
    const user = await findUser({ _id });
    if (!user) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const sessions = await findUserSessions({ user: _id, valid: true });

    return res.status(StatusCodes.OK).send(sessions);
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserPassHandler = async (
  req: Request<
    {},
    {},
    Omit<ChangeUserPassSchema["body"], "confirmPassword">,
    ChangeUserPassSchema["query"]
  >,
  res: Response
) => {
  const { newPassword } = req.body;
  const { userId, verifyCode } = req.query;
  try {
    const [randomId, creationDate] = verifyCode.split("-D");
    const timeValid = timeValidation(new Date(Number(creationDate)));
    if (!timeValid)
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("verify code has been expired!");

    const user = await findUser({ _id: userId });
    if (user?.validationCode !== verifyCode)
      return res.status(StatusCodes.UNAUTHORIZED).send("Invalid verify code!");

    const updatedUser = await findOneUserAndUpdate(
      { _id: userId },
      { password: newPassword, validationCode: null },
      { new: true }
    );
    return res.status(StatusCodes.ACCEPTED).send("Password has been updated!");
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
