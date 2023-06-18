import mongoose from "mongoose";
import logger from "lib/logger";

export default class MongoDB {
  private static connectURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017/${process.env.MONGO_INITDB_DATABASE}`;

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
