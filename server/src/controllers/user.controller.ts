import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { nanoidCustom } from "../models/user.model";
import {
  CreateUserWithPassSchema,
  ReqForLoginLinkSchema,
} from "../schemas/user.schema";
import { createUser, findOneUserAndUpdate } from "../services/user.service";
import sendEmail from "../utils/mailSender";
import config from "config";
import mailPayload from "../utils/mailPayload";

export const registerUserWithPassHandler = async (
  req: Request<{}, {}, Omit<CreateUserWithPassSchema, "confirmPassword">, {}>,
  res: Response
) => {
  try {
    const newUser = await createUser(req.body);
    // sendEamil
    const payload = mailPayload({
      from: config.get("smtp.user"),
      to: newUser.email,
      subject: "verify Accout",
      userId: newUser._id,
      verifyCode: newUser.validationCode,
      link: ` ${config.get("serverEndpoint")}/api/auth/?userId=${
        newUser._id as string
      }&verifyCode=${newUser.validationCode as string}`,
    });
    const emailSent = await sendEmail(payload);
    return res.status(201).send("User created successfully!");
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(StatusCodes.CONFLICT).send("User already exists");

    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const reqForLinkHandler = async (
  req: Request<{}, {}, {}, ReqForLoginLinkSchema>,
  res: Response
) => {
  const { email } = req.query;
  try {
    const user = await findOneUserAndUpdate(
      { email },
      {
        email,
        $set: { validationCode: `${nanoidCustom()}-D${Date.now()}` },
      },
      { new: true, upsert: true }
    );
    // send email
    if (!user) return res.sendStatus(StatusCodes.NOT_FOUND);

    const payload = mailPayload({
      from: config.get("smtp.user"),
      to: user?.email,
      subject: "Sign in link",
      userId: user?._id,
      verifyCode: user?.validationCode,
      link: ` ${config.get("serverEndpoint")}/api/auth/?userId=${
        user._id as string
      }&verifyCode=${user.validationCode as string}`,
    });
    const emailSent = await sendEmail(payload);
    if (emailSent)
      return res.status(StatusCodes.ACCEPTED).send("Email has been sent!");
    else
      return res
        .status(StatusCodes.REQUEST_TIMEOUT)
        .send("Couldn't send email!");
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getMe = async (req: Request, res: Response) =>
  res.send(res.locals.user);
