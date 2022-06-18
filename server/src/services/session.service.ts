import { get, omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SessionModel, { Session } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";
import config from "config";
import logger from "../utils/loggor";
import { decode } from "punycode";

export const createSession = async (userId: string, userAgent: string) =>
  (await SessionModel.create({ user: userId, userAgent })).toJSON();

export const findUserSessions = async (query: FilterQuery<Session>) =>
  await SessionModel.find(query).lean();

export const updateSession = async (
  query: FilterQuery<Session>,
  update: UpdateQuery<Session>,
  options: QueryOptions = {}
) => await SessionModel.updateOne(query, update, options);

export const reIssueNewAccToken = async (refreshToken: string) => {
  const { decoded, expired, valid } = verifyJwt({
    token: refreshToken,
    isAccToken: false,
  });

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: get(session, "user") });

  if (!user) return false;

  const tokenPayload = {
    ...omit(user, ["password", "validationCode"]),
    session: session._id,
  };

  const accessToken = signJwt({
    tokenPayload,
    isAccToken: true,
    options: { expiresIn: config.get("accTokenTimeToLive") },
  });

  return accessToken;
};
