import Router from "koa-router";
import { AuthController } from "modules/auth/controller/auth.controller";
import { activateSchema } from "modules/auth/schemas/activate.schema";
import { signInSchema } from "modules/auth/schemas/signin.schema";
import validate from "common/middlewares/validate.middleware";
import { signUpSchema } from "modules/auth/schemas/signup.schema";

const authRouter = new Router({
  prefix: "/api",
});

authRouter.post("/signup", validate(signUpSchema), AuthController.signup);
authRouter.get("/activate", validate(activateSchema), AuthController.activate);
authRouter.post("/signin", validate(signInSchema), AuthController.signin);
authRouter.post("/signout", AuthController.signout);
authRouter.get("/refresh", AuthController.refresh);

export default authRouter;
