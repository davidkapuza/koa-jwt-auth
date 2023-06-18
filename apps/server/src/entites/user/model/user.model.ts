import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { Roles } from "common/types";

@index({ email: 1 })
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ type: String }) name: string;
  @prop({ type: String, unique: true, required: true }) email: string;
  @prop({
    type: String,
    required: true,
    minlength: 8,
    maxLength: 32,
  })
  password: string;
  @prop({ type: Array, default: [Roles.User], allowMixed: 0 }) roles: string[];

  async comparePasswords(candidatePassword: string, hashedPassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

const userModel = getModelForClass(User);
export default userModel;
