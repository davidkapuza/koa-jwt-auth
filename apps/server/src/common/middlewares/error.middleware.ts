import ApiError from "common/errors/api.error";
import Koa, { Next } from "koa";
import logger from "lib/logger";
import { MongoError } from "mongodb";
import { Error } from "mongoose";

export default async (ctx: Koa.Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    logger.error(error);
    if (error instanceof ApiError) {
      ctx.body = error.toObject();
      ctx.status = error.statusCode;
    } else if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      ctx.status = 400;
      ctx.body = {
        message: "Invalid data provided",
        errors: messages,
      };
    } else if ((error as MongoError).code === 11000) {
      ctx.body = {
        message: "Duplicate",
        errors: [],
      };
    } else {
      ctx.body = { message: "Internal server error." };
      ctx.status = 500;
    }
  }
};
