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
      console.log("[ID] : ", id, token);
      if (id) {
        req.user_id = id;
        next();
      } else {
        res.redirect("/connexion/sign-up");
      }
    } catch (err) {
      res.redirect("connextion/sign-up");
    }
  }
}
