import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Session {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ default: true, type: Boolean })
  valid: boolean;
  @prop({ type: String })
  userAgent: string;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;
