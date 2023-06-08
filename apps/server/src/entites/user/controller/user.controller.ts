import Koa from "koa";
import UserService from "../services/user.service";

export default class UserController {
  public static async getUsers(ctx: Koa.Context) {
    const users = await UserService.getAllUsers();
    ctx.body = users;
  }
}
