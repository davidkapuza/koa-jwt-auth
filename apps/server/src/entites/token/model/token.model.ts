import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { User } from "entites/user/model/user.model";
import { Schema } from "mongoose";

@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Token {
  @prop({ type: Schema.Types.ObjectId, ref: "User" }) user: User;
  @prop({ type: String, required: true }) refreshToken: string;
}

const tokenModel = getModelForClass(Token);
export default tokenModel;
