import { object, string, TypeOf } from "zod";

export const signUpSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    password_confirm: string({
      required_error: "Please confirm your password",
    }),
  }).refine((data) => data.password === data.password_confirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export type signUpInput = TypeOf<typeof signUpSchema>["body"];
