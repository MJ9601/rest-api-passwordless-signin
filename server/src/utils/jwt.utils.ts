import jwt from "jsonwebtoken";
import config from "config";

const decodeStringBase64 = (key: string): string =>
  Buffer.from(key, "base64").toString("ascii");

const accTokenPriKey = decodeStringBase64(config.get<string>("accTokenPriKey"));

const accTokenPubKey = decodeStringBase64(config.get<string>("accTokenPubKey"));
const refTokenPriKey = decodeStringBase64(config.get<string>("refTokenPriKey"));
const refTokenPubKey = decodeStringBase64(config.get<string>("refTokenPubKey"));

export const signJwt = ({
  tokenPayload,
  isAccToken,
  options,
}: {
  tokenPayload: Object;
  isAccToken: boolean;
  options?: jwt.SignOptions | undefined;
}) =>
  isAccToken
    ? jwt.sign(tokenPayload, accTokenPriKey, {
        ...(options && options),
        algorithm: "RS256",
      })
    : jwt.sign(tokenPayload, refTokenPriKey, {
        ...(options && options),
        algorithm: "RS256",
      });

export const verifyJwt = ({
  token,
  isAccToken,
}: {
  token: string;
  isAccToken: boolean;
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
