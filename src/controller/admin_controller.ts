import { Request, Response } from "express";
import AdminCookieGen from "../libs/admin_cookie_gen";
import { CloudinaryClient } from "../libs/cloudinary_client";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export default class AdminController {
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
    const img_url = this.handle_image(req);

    if (!img_url) return res.status(500);

    res.send({ messae: "Upload successful !" }).status(200);
  }

  private static async handle_image(req: Request): Promise<void | string> {
    if (!req.file) return;
    const img_buffer = req.file.buffer;
    const response: UploadApiResponse | UploadApiErrorResponse | string | any =
      await CloudinaryClient.getInstance().upload_img(img_buffer);
    if (!("secure_url" in response)) {
      console.log("[IMAGE UPLOAD ERROR] : ");
      console.log(response.error || response.content);
      return;
    } else {
      console.log("[IMAGE UPLOAD SUCCESSFULLY]", response.secure_url);
      return response.secure_url;
    }
  }
}
