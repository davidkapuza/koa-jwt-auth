import config from "config";
import Koa from "koa";
import logger from "lib/logger";

export default function (app: Koa) {
  return function (cb: () => Promise<void>) {
    const PORT = config.get<number>("port");
    return app.listen(PORT, async () => {
      logger.info(`Server started on port: ${PORT}`);
      cb();
    });
  };
}
