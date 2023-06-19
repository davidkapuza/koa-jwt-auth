import middlewares from "common/middlewares";
import Koa from "koa";
import Mailer from "lib/mailer";
import MongoDB from "lib/mongodb";
import Redis from "lib/redis";
import router from "routes/router";
import server from "server";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const app = new Koa();

middlewares(app);
router(app)();
server(app)(async () => {
  await MongoDB.connect();
  await Redis.connect();
  await Mailer.init();
});
