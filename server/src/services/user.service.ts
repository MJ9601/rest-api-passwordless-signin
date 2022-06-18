import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UserModel, { User } from "../models/user.model";

export const createUser = async (payload: Partial<User>) =>
  await UserModel.create(payload);

export const findUser = async (query: FilterQuery<User>) =>
  await UserModel.findOne(query).lean();

export const findOneUserAndUpdate = async (
  query: FilterQuery<User>,
  update: UpdateQuery<User>,
  options: QueryOptions = {}
) => await UserModel.findOneAndUpdate(query, update, options);

export const DeleteUser = async (query: FilterQuery<User>) =>
  await UserModel.deleteOne(query);

export const validUserPassword = async ({
  email,
  password,
}: {
  email: User["email"];
  password: User["password"];
}) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return false;
    const isValid = await user.validatePassword(password);

    return !isValid ? false : user.toJSON();
  } catch (err: any) {
    return false;
  }
};
