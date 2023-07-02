import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cookieParser from "koa-cookie";
import helmet from "koa-helmet";
import errorMiddleware from "./error.middleware";
import { RateLimit } from "koa2-ratelimit";

const limiter = RateLimit.middleware({
  interval: { min: 15 },
  max: 100,
  message: "Slow down a bit.",
});

export default function (app: Koa) {
  app.use(helmet());
  app.use(bodyParser({ enableTypes: ["json"] }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_HOST,
      credentials: true,
    })
  );
  app.use(limiter);
  app.use(errorMiddleware);
}
