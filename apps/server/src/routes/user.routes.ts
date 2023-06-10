import UserController from "entites/user/controller/user.controller";
import Router from "koa-router";
import requireAuth from "modules/auth/middlewares/require-auth.middleware";

const userRouter = new Router({
  prefix: "/api",
});

userRouter.get("/me", requireAuth(), UserController.getSelf);

export default userRouter;
