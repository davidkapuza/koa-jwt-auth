import Koa from "koa";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

export default function (app: Koa) {
  return function () {
    app.use(authRouter.routes());
    app.use(authRouter.allowedMethods());
    app.use(userRouter.routes());
    app.use(userRouter.allowedMethods());
  };
}
