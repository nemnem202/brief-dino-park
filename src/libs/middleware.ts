import { NextFunction, Request, Response } from "express";
import AdminCookieGen from "./admin_cookie_gen";

export class MiddleWare {
  static async check_admin_auth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.admin_token;
      const auth = await AdminCookieGen.verify_token(token);
      if (!auth) {
        res.status(400);
        res.send({ message: "failed to auth" });
        return;
      }

      next();
    } catch (err) {
      res.status(400);
      res.send({ message: "auth_token missing !" });
    }
  }

  //   static check_file_format(file: File, mime_types: string[]) {
  //     if (mime_types.includes(file.))
  //   }
}
