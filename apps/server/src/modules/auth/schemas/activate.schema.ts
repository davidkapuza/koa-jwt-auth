import { object, string, TypeOf } from "zod";

export const activateSchema = object({
  query: object({
    key: string().length(32),
    email: string().email(),
  }),
});
export type activateInput = TypeOf<typeof activateSchema>["query"];
