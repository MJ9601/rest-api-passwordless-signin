import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SessionModel, { Session } from "../models/session.model";

export const createSession = async (userId: string, userAgent: string) =>
  (await SessionModel.create({ user: userId, userAgent })).toJSON();

export const findUserSessions = async (query: FilterQuery<Session>) =>
  await SessionModel.find(query).lean();

export const updateSession = async (
  query: FilterQuery<Session>,
  update: UpdateQuery<Session>,
  options: QueryOptions = {}
) => await SessionModel.updateOne(query, update, options);

export const reIssueNewAccToken = async (refreshToken: string) => {};
