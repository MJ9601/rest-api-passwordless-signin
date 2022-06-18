import { object, string, TypeOf } from "zod";

export const createSessionWithPassSchema = object({
  body: object({
    email: string({ required_error: "email is required!" }).email(
      "Invalid email!"
    ),
    password: string({ required_error: "password is required!" }).min(
      6,
      "Password length must be at least 6 chars!"
    ),
  }),
});

export type CreateSessionWithPassSchema = TypeOf<
  typeof createSessionWithPassSchema
>["body"];
