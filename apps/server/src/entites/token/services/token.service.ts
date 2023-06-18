import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { TUser } from "common/types";
import UserDto from "entites/user/dto/user.dto";
import tokenModel from "../model/token.model";

export default class TokenService {
  public static generateTokens(payload: TUser) {
    const accessToken = sign(payload, process.env.JWT_ACCESS_KEY!, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = sign(payload, process.env.JWT_REFRESH_KEY!, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }
  public static async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  public static async removeToken(refreshToken: string) {
    await tokenModel.deleteOne({ refreshToken });
  }
  public static validateAccessToken(accessToken: string) {
    try {
      const userData = verify(accessToken, process.env.JWT_ACCESS_KEY!);
      return userData;
    } catch (error) {
      return null;
    }
  }
  public static validateRefreshToken(refreshToken: string) {
    try {
      const userData = verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY!
      ) as UserDto;
      return userData;
    } catch (error) {
      return null;
    }
  }
  public static async findToken(refreshToken: string) {
    const token = await tokenModel.findOne({ refreshToken });
    return token;
  }
}
