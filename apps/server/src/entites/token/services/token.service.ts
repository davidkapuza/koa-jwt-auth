import { TUser } from "common/types";
import config from "config";
import UserDto from "entites/user/dto/user.dto";
import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import tokenModel from "../model/token.model";

export default class TokenService {
  public static generateTokens(payload: TUser) {
    const accessToken = sign(payload, config.get("jwt.accessKey"), {
      expiresIn: config.get("jwt.accessTokenExpiration"),
    });
    const refreshToken = sign(payload, config.get("jwt.refreshKey"), {
      expiresIn: config.get("jwt.refreshTokenExpiration"),
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
      const userData = verify(accessToken, config.get("jwt.accessKey"));
      return userData;
    } catch (error) {
      return null;
    }
  }
  public static validateRefreshToken(refreshToken: string) {
    try {
      const userData = verify(
        refreshToken,
        config.get("jwt.refreshKey")
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
