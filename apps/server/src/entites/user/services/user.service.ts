import UserDto from "../dto/user.dto";
import userModel from "../model/user.model";

export default class UserService {
  public static async getSelf(id: string) {
    const userFromDb = await userModel.findById(id);
    const user = new UserDto(userFromDb!);
    return user;
  }
}
