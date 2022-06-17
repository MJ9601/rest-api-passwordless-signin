import {
  prop,
  pre,
  getModelForClass,
  modelOptions,
  Severity,
  DocumentType,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { customAlphabet } from "nanoid";
import logger from "../utils/loggor";

const pickUpString =
  "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
export const nanoidCustom = customAlphabet(pickUpString, 10);

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await argon2.hash(this.password);
  this.password = hash;

  return;
})
export class User {
  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ required: true })
  name: string;

  @prop()
  password: string;

  @prop({ default: false })
  profileVerified: boolean;

  @prop({ default: () => `${nanoidCustom()}-D${new Date()}` })
  validationCode: string;

  async validatePassword(this: DocumentType<User>, passwordOnReq: string) {
    try {
      return await argon2.verify(this.password, passwordOnReq);
    } catch (err: any) {
      logger.error(err, "Couldn't verify Password!");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
