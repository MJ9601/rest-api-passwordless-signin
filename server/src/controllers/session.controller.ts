import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ChangeUserPassSchema,
  VerifyUserWithLinkSchema,
} from "../schemas/user.schema";
import { findOneUserAndUpdate, findUser } from "../services/user.service";
import timeValidation from "../utils/timeValidation";

export const verifyUserEmailHandler = async (
  req: Request<{}, {}, {}, VerifyUserWithLinkSchema>,
  res: Response
) => {
  const { userId, verifyCode } = req.query;
  try {
    const [randomId, creationDate] = verifyCode.split("-D");
    const isNotExpired = timeValidation(new Date(creationDate), 24);
    if (!isNotExpired)
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("Verification code is Expired!");

    const user = await findUser({ _id: userId });

    if (verifyCode !== user?.validationCode)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .send("Invalid Verify Code!");

    const updatedUser = await findOneUserAndUpdate(
      { _id: userId },
      { profileVerified: true, $set: { validationCode: null } },
      { new: true }
    );
    return res.status(StatusCodes.ACCEPTED).send("Email has been verified!");
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
    const isNotExpired = timeValidation(new Date(creationDate), 24);
    if (!isNotExpired)
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("Verification code is Expired!");

    const user = await findUser({ _id: userId });

    if (verifyCode !== user?.validationCode)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .send("Invalid Verify Code!");

    const updatedUser = await findOneUserAndUpdate(
      { _id: userId },
      { $set: { password: newPassword } },
      { new: true }
    );
    return res.status(StatusCodes.ACCEPTED).send("Email has been verified!");
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
