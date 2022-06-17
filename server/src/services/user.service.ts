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
