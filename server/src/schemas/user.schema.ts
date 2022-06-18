import { object, string, TypeOf } from "zod";

export const createUserWithPassSchema = object({
  body: object({
    email: string({ required_error: "email is required!" }).email({
      message: "email is not valid!",
    }),
    name: string({ required_error: "name is required!" }),
    password: string({ required_error: "password is required!" }).min(
      6,
      "minimum length of password is 6 chars"
    ),
    confirmPassword: string({
      required_error: "confirmPassword is required!",
    }).min(6, "minimum length is 6 chars"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmedPassword"],
  }),
});

export type CreateUserWithPassSchema = TypeOf<
  typeof createUserWithPassSchema
>["body"];

export const verifyUserWithLinkSchema = object({
  query: object({
    userId: string({ required_error: "userId is required!" }),
    verifyCode: string({ required_error: "code is required!" }),
  }),
});

export type VerifyUserWithLinkSchema = TypeOf<
  typeof verifyUserWithLinkSchema
>["query"];

export const changeUserPassSchema = object({
  query: object({
    userId: string({ required_error: "userId is required!" }),
    verifyCode: string({ required_error: "code is required!" }),
  }),
  body: object({
    newPassword: string({ required_error: "password is required!" }).min(
      6,
      "minimum length of password is 6 chars"
    ),
    confirmPassword: string({
      required_error: "confirmPassword is required!",
    }).min(6, "minimum length is 6 chars"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmedPassword"],
  }),
});

export type ChangeUserPassSchema = TypeOf<typeof changeUserPassSchema>;

export const reqForLoginLinkSchema = object({
  query: object({
    email: string({ required_error: "email is required!" }).email(),
  }),
});

export type ReqForLoginLinkSchema = TypeOf<
  typeof reqForLoginLinkSchema
>["query"];
