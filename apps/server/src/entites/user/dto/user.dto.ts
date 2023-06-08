import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../model/user.model";

export default class UserDto extends User {
  id: Types.ObjectId;
  constructor(user: DocumentType<User>) {
    super();
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.roles = user.roles;
  }
}
