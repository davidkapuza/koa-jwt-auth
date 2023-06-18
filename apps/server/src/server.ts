import Koa from "koa";
import logger from "lib/logger";

export default function (app: Koa) {
  return function (cb: () => Promise<void>) {
    const PORT = process.env.PORT;
    return app.listen(PORT, async () => {
      logger.info(`Server started on port: ${PORT}`);
      cb();
    });
  };
}
