import ApiError from "common/errors/api.error";
import TokenService from "entites/token/services/token.service";
import Koa, { Next } from "koa";

export default () => (ctx: Koa.Context, next: Next) => {
  try {
    const authorizationHeader = ctx.header.authorization;
    if (!authorizationHeader) {
      throw ApiError.UnauthorizedError();
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateAccessToken(accessToken);

    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    ctx.state.user = userData;
    return next();
  } catch (error) {
    throw ApiError.UnauthorizedError();
  }
};
