import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser } from "../services/user.service";

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);

    return res.status(201).send("User created successfully!");
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(StatusCodes.CONFLICT).send("User already exists");

    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
