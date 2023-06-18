import Koa from "koa";
import { activateInput } from "../schemas/activate.schema";
import { signInInput } from "../schemas/signin.schema";
import { signUpInput } from "../schemas/signup.schema";
import AuthService from "../services/auth.service";

export class AuthController {
  public static async signup(ctx: Koa.Context) {
    const input = ctx.request.body as signUpInput;
    await AuthService.signup(input);
    ctx.body = {
      message: "We sent a link to activate your account",
    };
  }
  public static async activate(ctx: Koa.Context) {
    const query = ctx.query as activateInput;
    const userData = await AuthService.activate(query);
    ctx.cookies.set("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION!),
    });
    ctx.body = userData;
    ctx.response.redirect(process.env.CLIENT_HOST!);
  }
  public static async signin(ctx: Koa.Context) {
    const input = ctx.request.body as signInInput;
    const userData = await AuthService.signin(input);
    ctx.cookies.set("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION!),
    });
    ctx.body = userData;
  }
  public static async signout(ctx: Koa.Context) {
    const refreshToken = ctx.cookies.get("refreshToken");
    await AuthService.signout(refreshToken);
    ctx.cookies.set("refreshToken", "");
    ctx.status = 200;
  }
  public static async refresh(ctx: Koa.Context) {
    const refreshToken = ctx.cookies.get("refreshToken");
    const userData = await AuthService.refresh(refreshToken);
    ctx.cookies.set("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION!),
    });
    ctx.body = userData;
  }
}
