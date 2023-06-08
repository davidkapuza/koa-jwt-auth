import cors from "@koa/cors";
import config from "config";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cookieParser from "koa-cookie";
import helmet from "koa-helmet";
import errorMiddleware from "./error.middleware";

export default function (app: Koa) {
  app.use(helmet());
  app.use(bodyParser({ enableTypes: ["json"] }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.get("serverHost"),
      credentials: true,
    })
  );
  app.use(errorMiddleware);
}
