import { User } from "entites/user/model/user.model";

export enum Roles {
  User = "user",
  Admin = "admin",
}

export type TUser = Omit<User, "comparePasswords">;
