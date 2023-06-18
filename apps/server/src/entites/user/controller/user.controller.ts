import Koa from "koa";
import UserService from "../services/user.service";

export default class UserController {
  public static async getSelf(ctx: Koa.Context) {
    const users = await UserService.getSelf(ctx.state.user.id);
    ctx.body = users;
  }
}
