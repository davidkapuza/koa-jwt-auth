import { jwtVerify } from "jose";
import { User } from "../../../shared/types";

interface UserJwtPayload extends User {
  exp: number;
  iat: number;
}

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env?.["JWT_REFRESH_KEY"]!)
    );
    return verified.payload as unknown as UserJwtPayload;
  } catch (error) {
    console.error(error);
  }
};
