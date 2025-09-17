import { Request, Response } from "express";
import AdminCookieGen from "../libs/admin_cookie_gen";
import { CloudinaryClient } from "../libs/cloudinary_client";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { z } from "zod";
import DinoRepository from "../repositories/dino_repository";
import { DinosaureDTO, DinosaureEntity } from "../types/models/dinosaure";

export default class AdminController {
  private static dino_repo = new DinoRepository();

  private static dino_schema = z.object({
    dinosaure_name: z
      .string()
      .min(1, "Le nom est requis")
      .max(100, "Le nom est trop long, max 100 charactères !"),
    dinosaure_description: z
      .string()
      .min(1, "La description est requise")
      .max(1000, "la description est trop longue, max 1000 caractères !"),
    dinosaure_regime: z
      .string()
      .min(1, "Le régime est requis")
      .max(300, "Le régime est trop long, max 300 charactères !"),
  });

  static dino_upload_page(_: Request, res: Response) {
    res.render("admin/dinosaure_upload.ejs");
  }

  static async dino_post(req: Request, res: Response) {
    try {
      const img_properties = await this.handle_image(req);
      const parsed_body = this.dino_schema.parse(req.body);

      if (!img_properties) {
        console.error("[IMAGE] : incorrect");
        return res.status(400).send({ message: "Please enter a correct image" });
      }

      const dino: DinosaureDTO = {
        image_dinosaure: img_properties.url,
        image_dinosaure_id: img_properties.id,
        nom_dinosaure: parsed_body.dinosaure_name,
        description_dinosaure: parsed_body.dinosaure_description,
        regime_dinosaure: parsed_body.dinosaure_regime,
      };

      const dino_add = await this.dino_repo.add_item(dino);

      if (dino_add) {
        const all_dino = await this.dino_repo.findAll();
        console.log("[UPDATE DINO] : ", all_dino);
        return res.status(200).send({ message: dino });
      } else {
        return res.status(500).send({ message: "erreur de la db" });
      }
    } catch (err) {
      console.error("[ERROR] : " + err);
      if (err instanceof z.ZodError) {
        return res.status(400).send({
          message: "Validation échouée",
          errors: err.issues, // tableau brut
          // ou si tu veux seulement les messages :
          messages: err.issues.map((e) => e.message),
        });
      }
      return res.status(400).send({ message: err });
    }
  }

  private static async handle_image(req: Request): Promise<void | { url: string; id: string }> {
    if (!req.file) {
      console.error("[NO FILE]");
      return;
    }
    const img_buffer = req.file.buffer;
    const response: UploadApiResponse | UploadApiErrorResponse | string | any =
      await CloudinaryClient.getInstance().upload_img(img_buffer);
    if (!("secure_url" in response)) {
      console.log("[IMAGE UPLOAD ERROR] : ");
      console.log(response.error || response.content);
      return;
    } else {
      console.log("[IMAGE UPLOAD SUCCESSFULLY]", response.secure_url);
      return { url: response.secure_url, id: response.public_id };
    }
  }

  static async get_gateway_cookie(_: Request, res: Response) {
    const token = await AdminCookieGen.generate_token();
    if (!token) {
      res.status(500).send("une erreur est survenue");
      return;
    }
    res
      .cookie("admin_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60,
      })
      .redirect("/admin/board");
  }

  static async board_page(_: Request, res: Response) {
    const repo = new DinoRepository();
    let dinos = await repo.findAll();
    if (!dinos) dinos = [];
    res.render("admin/board.ejs", { dinos: dinos });
  }

  static async remove_dino(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(404);
    const repo = new DinoRepository();
    const removed = await repo.remove_item(parseInt(id));
    if (removed) {
      console.log("[DINOSAURE REMOVED] : ", id);
      return res.status(200).send({ message: "dino removed !" });
    } else {
      return res.status(400).send({ message: "an error occured" });
    }
  }
}
