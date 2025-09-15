import argon2 from "argon2";

export default class AdminCookieGen {
  static async generate_token(): Promise<string | null> {
    try {
      if (!process.env.ADMIN_SECRET) return null;
      const token = await argon2.hash(process.env.ADMIN_SECRET);
      return token;
    } catch (err) {
      return null;
    }
  }
  static async verify_token(token: string): Promise<boolean> {
    if (!process.env.ADMIN_SECRET) return false;
    return await argon2.verify(token, process.env.ADMIN_SECRET);
  }
}
