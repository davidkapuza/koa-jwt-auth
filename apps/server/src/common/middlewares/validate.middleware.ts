import Koa, { Next } from "koa";
import { AnyZodObject, ZodError } from "zod";

export default (schema: AnyZodObject) => (ctx: Koa.Context, next: Next) => {
  try {
    schema.parse({
      params: ctx.params,
      query: ctx.request.query,
      body: ctx.request.body,
    });

    return next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      ctx.status = 400;
      ctx.body = err.errors;
    }
  }
};
