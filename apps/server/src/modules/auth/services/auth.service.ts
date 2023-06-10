import ApiError from "common/errors/api.error";
import { Roles } from "common/types";
import { buildUrl } from "common/utils/buildUrl";
import { decrypt } from "common/utils/decrypt";
import { encrypt } from "common/utils/encrypt";
import config from "config";
import { randomBytes } from "crypto";
import ejs from "ejs";
import TokenService from "entites/token/services/token.service";
import UserDto from "entites/user/dto/user.dto";
import userModel from "entites/user/model/user.model";
import Mailer from "lib/mailer";
import Redis from "lib/redis";
import path from "path";
import { activateInput } from "../schemas/activate.schema";
import { signInInput } from "../schemas/signin.schema";
import { signUpInput } from "../schemas/signup.schema";

export default class AuthService {
  public static async signup({ name, email, password }: signUpInput) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest("This user already exists");
    }
    const cached = await Redis.get(email);
    if (cached) {
      throw ApiError.BadRequest(
        "User is already in the process of registration"
      );
    }
    const user = {
      name,
      email,
      password,
      roles: [Roles.User],
    };

    const key = randomBytes(16).toString("hex").slice(0, 32);
    const confirmationLink = buildUrl(
      config.get("serverHost"),
      "/api/activate",
      { email, key }
    );
    const encryptedData = encrypt("aes-256-ctr", key, user);
    const template = await ejs.renderFile(
      path.join(__dirname, "../templates/confirm-email.ejs"),
      {
        userName: name,
        confirmationLink,
        sender: config.get("mailer.email"),
      }
    );
    await Mailer.sendMail(email, "Activation link", "", template);
    await Redis.set(email, encryptedData);
  }

  public static async activate({ email, key }: activateInput) {
    const encrypteUserData = await Redis.get(email);
    if (!encrypteUserData) {
      throw ApiError.BadRequest(
        "The activation time has expired or provided email are invalid."
      );
    }
    const userData = decrypt("aes-256-ctr", key, encrypteUserData);
    if (!userData) {
      throw ApiError.BadRequest("Provided data are invalid.");
    }

    await Redis.delete(email);
    const storedUser = await userModel.create(userData);
    const user = new UserDto(storedUser);
    const tokens = TokenService.generateTokens({ ...user });
    await TokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }

  public static async signin({ email, password }: signInInput) {
    const candidate = await userModel.findOne({ email });
    if (
      !candidate ||
      !(await candidate.comparePasswords(password, candidate.password))
    ) {
      throw ApiError.UnauthorizedError();
    }
    const user = new UserDto(candidate);
    const tokens = TokenService.generateTokens({ ...user });
    await TokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }

  public static async signout(refreshToken?: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    await TokenService.removeToken(refreshToken);
  }

  public static async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const userFromDb = await userModel.findById(userData.id);
    if (!userFromDb) throw ApiError.UnauthorizedError();

    const user = new UserDto(userFromDb);
    const tokens = TokenService.generateTokens({ ...user });
    await TokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }
}
