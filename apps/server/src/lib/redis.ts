import { RedisClientType, createClient } from "redis";
import logger from "./logger";

export default class Redis {
  public static client: RedisClientType = createClient({
    url: process.env.REDIS_URL,
  });

  public static async connect() {
    return await this.client
      .connect()
      .then(() => logger.info("Connection with redis established..."))
      .catch((error) => logger.error(error.message));
  }
  public static async get(key: string) {
    try {
      return await this.client.get(key);
    } catch (error) {
      throw new Error("Error occured while getting data...");
    }
  }

  public static async set(key: string, value: string) {
    try {
      await this.client.set(key, value, { EX: 60 * 5 });
    } catch (error) {
      throw new Error("Error occured while setting data...");
    }
  }

  public static async delete(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      throw new Error("Error occured while deleting data...");
    }
  }
}
