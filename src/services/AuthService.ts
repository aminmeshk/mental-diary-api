import { JwtUserPayload, LoginRequest, SignupRequest } from "../models";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories";
import jwt from "jsonwebtoken";

class AuthService {
  createUser = async (request: SignupRequest) => {
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = await UserRepository.add({
      username: request.username.trim().toLowerCase(),
      email: request.email.trim().toLowerCase(),
      hashed_password: hashedPassword,
    });
    return user;
  };

  verifyPassword = async (request: LoginRequest) => {
    const dbUser = await UserRepository.findByUsername(
      request.username.trim().toLowerCase()
    );
    if (!dbUser) {
      return null;
    }
    const verified = await bcrypt.compare(request.password, dbUser.hashed_password)
    if (!verified) {
      return null;
    }
    return UserRepository.toDto(dbUser);
  };

  verifyToken = async (token: string) => {
    return new Promise<JwtUserPayload>((resolve, reject) => {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }
          const userPayload = (decoded as jwt.JwtPayload)?.user;
          if (!userPayload) {
            reject(new Error('Invalid authorization token'));
            return;
          }
          resolve(userPayload as JwtUserPayload);
        }
      );
    });
  };

  createToken = async (userId: number, username: string) => {
    const user: JwtUserPayload = { username: username, userId: userId };
    const payload = { user: user };
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, token) => {
          if (err) {
            reject(err);
            return;
          }
          if (!token) {
            reject(new Error("Cannot create token"));
            return;
          }
          resolve(token);
        }
      );
    });
  };
}

const authService = new AuthService();

export default authService;
