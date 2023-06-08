import mongoose from "mongoose";
import config from "config";
import logger from "lib/logger";

export default class MongoDB {
  private static connectURL = `mongodb://${config.get(
    "mongodb.userName"
  )}:${config.get("mongodb.password")}@localhost:6000/${config.get(
    "mongodb.name"
  )}`;

  public static async connect() {
    await mongoose
      .connect(this.connectURL)
      .then(() => logger.info("Database connected..."))
      .catch((error) => {
        logger.error(error.message);
        setTimeout(this.connect, 5000);
      });
  }
}
