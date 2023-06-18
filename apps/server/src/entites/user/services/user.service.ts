import ApiError from "common/errors/api.error";
import UserDto from "../dto/user.dto";
import userModel from "../model/user.model";

export default class UserService {
  public static async getSelf(id: string) {
    const userFromDb = await userModel.findById(id);
    if (!userFromDb) throw ApiError.UnauthorizedError();
    const user = new UserDto(userFromDb);
    return user;
  }
}
