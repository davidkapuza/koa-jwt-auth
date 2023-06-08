import { User } from "entites/user/model/user.model";
import Koa, { Next } from "koa";

export default (...allowedRoles: string[]) =>
  (ctx: Koa.Context, next: Next) => {
    const user: User | undefined = ctx.state.user;
    if (!user || !allowedRoles.some((role) => user.roles.includes(role))) {
      ctx.throw(403, "You are not allowed to perform this action");
    }
    return next();
  };
