import userModel from "../model/user.model";

export default class UserService {
  public static async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}
