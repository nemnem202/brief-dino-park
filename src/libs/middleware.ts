import { NextFunction, Request, Response } from "express";
import CookieGen from "./cookie_gen";

declare module "express-serve-static-core" {
  interface Request {
    user_id?: string;
  }
}

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

  static async check_user_auth(req: Request, res: Response, next: NextFunction) {
    console.log("[USER AUTH ATTEMPT]");

    try {
      const token = req.cookies.user_token;
      const id = CookieGen.check_user_id_from_token(token);
      if (id) {
        req.user_id = id;
        next();
      } else {
        next();
      }
    } catch (err) {
      next();
    }
  }

  //   static check_file_format(file: File, mime_types: string[]) {
  //     if (mime_types.includes(file.))
  //   }
}
