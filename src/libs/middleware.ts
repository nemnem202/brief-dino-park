import { NextFunction, Request, Response } from "express";
import CookieGen from "./cookie_gen";

export class MiddleWare {
  static async check_admin_auth(req: Request, res: Response, next: NextFunction) {
    console.log("[ADMIN AUTH ATTEMPT]");
    try {
      const token = req.cookies.admin_token;
      const auth = await CookieGen.verify_admin_token(token);
      if (!auth) {
        console.log("[FAIL TO AUTH AS ADMIN]");
        res.status(400);
        res.send({ message: "failed to auth" });
        return;
      }
      console.log("[ADMIN AUTH SUCCESSFUL]");
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
