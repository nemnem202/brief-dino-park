import argon2 from "argon2";
import jwt from "jsonwebtoken";

export default class CookieGen {
  static async generate_admin_token(): Promise<string | null> {
    const admin_key = process.env.ADMIN_SECRET;
    if (!admin_key) return null;
    try {
      const token = await argon2.hash(admin_key);
      return token;
    } catch (err) {
      return null;
    }
  }

  static async verify_admin_token(token: string): Promise<boolean> {
    if (!process.env.ADMIN_SECRET) return false;
    return await argon2.verify(token, process.env.ADMIN_SECRET);
  }

  static generate_user_token(userId: string): string | null {
    const user_key = process.env.USER_SECRET;
    if (!user_key) return null;
    return jwt.sign({ userId }, user_key, { expiresIn: "1h" });
  }

  static check_user_id_from_token(token: string): string | null {
    const user_key = process.env.USER_SECRET;
    if (!user_key) return null;
    try {
      const decoded = jwt.verify(token, user_key) as { userId: string };
      return decoded.userId;
    } catch (err) {
      return null;
    }
  }
}
