import jwt from "jsonwebtoken";
import config from "config";

const accTokenPriKey = config.get<string>("accTokenPriKey");
const accTokenPubKey = config.get<string>("accTokenPubKey");
const refTokenPriKey = config.get<string>("refTokenPriKey");
const refTokenPubKey = config.get<string>("refTokenPubKey");

export const signJwt = ({
  payload,
  isAccToken,
  options,
}: {
  payload: Object;
  isAccToken?: boolean;
  options?: jwt.SignOptions | undefined;
}) =>
  isAccToken
    ? jwt.sign(payload, accTokenPriKey, {
        ...(options && options),
        algorithm: "RS256",
      })
    : jwt.sign(payload, refTokenPriKey, {
        ...(options && options),
        algorithm: "RS256",
      });

export const verifyJwt = ({
  token,
  isAccToken,
}: {
  token: string;
  isAccToken?: boolean;
}) => {
  try {
    const decoded = isAccToken
      ? jwt.verify(token, accTokenPubKey)
      : jwt.verify(token, refTokenPubKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message,
      decoded: null,
    };
  }
};
