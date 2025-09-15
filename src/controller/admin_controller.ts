import { NextFunction, Request, Response } from "express";
import AdminCookieGen from "../libs/admin_cookie_gen";

export default class AdminController {
  static async chechAuth(req: Request, res: Response, next: NextFunction) {
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

  static async dino_upload_page(_: Request, res: Response) {
    const token = await AdminCookieGen.generate_token();
    if (!token) {
      res.status(500).send("une erreur est survenue");
      return;
    }
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    });
    res.render("admin/dinosaure_upload.ejs");
  }

  static async dino_post(req: Request, res: Response) {
    res.send({ token: "coucou" });
  }
}
