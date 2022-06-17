import { Request, Response } from "express";
import { rmSync } from "fs";
import { StatusCodes } from "http-status-codes";
import { nanoidCustom } from "../models/user.model";
import {
  ChangeUserPassSchema,
  CreateUserWithPassSchema,
  ReqForLoginLinkSchema,
  VerifyUserWithLinkSchema,
} from "../schemas/user.schema";
import {
  createUser,
  findOneUserAndUpdate,
  findUser,
} from "../services/user.service";
import timeValidation from "../utils/timeValidation";

export const registerUserWithPassHandler = async (
  req: Request<{}, {}, Omit<CreateUserWithPassSchema, "confirmPassword">, {}>,
  res: Response
) => {
  try {
    const newUser = await createUser(req.body);
    // sendEamil

    return res.status(201).send("User created successfully!");
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(StatusCodes.CONFLICT).send("User already exists");

    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const createUserWithEmailOrReqForLinkHandler = async (
  req: Request<{}, {}, {}, ReqForLoginLinkSchema>,
  res: Response
) => {
  const { email } = req.query;
  try {
    const user = await findOneUserAndUpdate(
      { email },
      {
        email,
        $set: { validationCode: () => `${nanoidCustom()}-D${new Date()}` },
      },
      { new: true, upsert: true }
    );
    // send email
    return res.status(StatusCodes.ACCEPTED).send("Email has been sent!");
  } catch (err: any) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
