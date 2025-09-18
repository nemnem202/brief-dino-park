import { Request, Response } from "express";
import { CloudinaryClient } from "../libs/cloudinary_client";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { z } from "zod";
import DinoRepository from "../repositories/dino_repository";
import { DinosaureDTO, DinosaureEntity } from "../types/models/dinosaure";
import { BilletDTO, BilletEntity } from "../types/models/billet";
import { BilletRepository } from "../repositories/billet_repository";
import CookieGen from "../libs/cookie_gen";
import { VoirDinoRepository } from "../repositories/voir_dino_repository";
import { Voir_DinosaureEntity, VoirDinosaureDTO } from "../types/models/voir_dinosaure";
import { TarifRepository } from "../repositories/tarif_repository";
import { TarifDTO, TarifEntity } from "../types/models/tarif";
import { InclureBilletRepository } from "../repositories/inclure_billet_repository";

export default class AdminController {
  private static dino_repo = new DinoRepository();
  private static billet_repo = new BilletRepository();
  private static voir_dino_repo = new VoirDinoRepository();
  private static tarif_repo = new TarifRepository();
  private static inclure_billet_repo = new InclureBilletRepository();

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

  private static billet_schema = z.object({
    titre_billet: z
      .string()
      .min(1, "Le titre est requis")
      .max(100, "Le titre est trop long, max 100 caractères"),
    description_billet: z
      .string()
      .min(1, "La description est requise")
      .max(1000, "La description est trop longue, max 1000 caractères"),
    prix_billet: z.coerce.number().refine((val) => /^\d{1,13}(\.\d{1,2})?$/.test(val.toString()), {
      message: "Le prix doit comporter jusqu'à 15 chiffres au total, dont 2 décimales maximum",
    }),
    dino_id_array: z
      .string()
      .transform((val) => {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      })
      .pipe(z.array(z.string())),

    age_minimum: z.coerce.number().int("L'âge minimum doit être un entier"),
  });

  private static tarif_schema = z.object({
    titre_tarif: z.string().min(1).max(50),
    coefficient_tarif: z.coerce
      .number()
      .refine((val) => /^\d{1,13}(\.\d{1,2})?$/.test(val.toString()), {
        message: "Le prix doit comporter jusqu'à 15 chiffres au total, dont 2 décimales maximum",
      }),
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
    const token = await CookieGen.generate_admin_token();
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
    const dinos: DinosaureEntity[] = (await this.dino_repo.findAll()) ?? [];
    const billets: BilletEntity[] = (await this.billet_repo.findAll()) ?? [];
    const voir_dino: Voir_DinosaureEntity[] = (await this.voir_dino_repo.findAll()) ?? [];
    const tarifs: TarifEntity[] = (await this.tarif_repo.findAll()) ?? [];
    res.render("admin/board.ejs", {
      dinos: dinos,
      billets: billets,
      voir_dino: voir_dino,
      tarifs: tarifs,
      is_admin: true,
    });
  }

  static async remove_dino(req: Request, res: Response) {
    console.log("[REMOVE DINO ATTEMPT]");
    const id = req.params.id;
    if (!id) return res.status(404);

    this.dino_repo.get_prop_by_key(parseInt(id), "image_dinosaure_id").then(async (img_id) => {
      if (!img_id) return res.status(400);
      console.log("[REMOVE IMG ATTEMPT] : for", img_id);
      const remove_img = await CloudinaryClient.getInstance().remove_img(img_id);
      console.log("[REMOVE IMG] : ", remove_img);
    });

    const links = await this.voir_dino_repo.findAll();

    if (links) {
      console.log("[LINKS FOUND] :", links);
      for (const l of links.filter((l) => String(l.code_dinosaure) === String(id))) {
        console.log("[TRYING TO REMOVE]", id, "in", l);
        await this.voir_dino_repo.remove_item(Number(l.id));
      }
    }

    const removed = await this.dino_repo.remove_item(parseInt(id));
    if (removed) {
      console.log("[DINOSAURE REMOVED] : ", id);
      return res.status(200).send({ message: "dino removed !" });
    } else {
      console.log("[REMOVE DINO] : fail");
      return res.status(400).send({ message: "an error occured" });
    }
  }

  static async billet_upload_page(_: Request, res: Response) {
    const dinos = (await this.dino_repo.findAll()) ?? [];
    res.render("admin/billet_upload.ejs", { dinos: dinos });
  }

  static async billet_post(req: Request, res: Response) {
    console.log("[BILLET POST REQUEST");

    try {
      const img_properties = await this.handle_image(req);
      const parsed_body = this.billet_schema.parse(req.body);

      if (!img_properties) {
        console.error("[IMAGE] : incorrect");
        return res.status(400).send({ message: "Please enter a correct image" });
      }

      const billet: BilletDTO = {
        age_minimum: parsed_body.age_minimum,
        description_billet: parsed_body.description_billet,
        image_billet: img_properties.url,
        image_billet_id: img_properties.id,
        prix_billet: parsed_body.prix_billet,
        titre_billet: parsed_body.titre_billet,
      };
      const billet_add = await this.billet_repo.add_item(billet);

      if (billet_add) {
        parsed_body.dino_id_array.forEach((e) => {
          const item: VoirDinosaureDTO = {
            code_billet: String(billet_add.id),
            code_dinosaure: e,
          };
          this.voir_dino_repo.add_item(item);
        });

        console.log("[UPDATE BILLET] : ", billet_add);
        return res.status(200).send({ message: billet });
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

  static async remove_billet(req: Request, res: Response) {
    console.log("[REMOVE BILLET ATTEMPT]");
    const id = req.params.id;
    if (!id) return res.status(404);

    this.billet_repo.get_prop_by_key(parseInt(id), "image_billet_id").then(async (img_id) => {
      if (!img_id) return;
      console.log("[REMOVE IMG ATTEMPT] : for", img_id);
      const remove_img = await CloudinaryClient.getInstance().remove_img(img_id);
      console.log("[REMOVE IMG] : ", remove_img);
    });

    const links = await this.voir_dino_repo.findAll();

    if (links) {
      console.log("[LINKS FOUND] :", links);
      for (const l of links.filter((l) => String(l.code_billet) === String(id))) {
        console.log("[TRYING TO REMOVE]", id, "in", l);
        await this.voir_dino_repo.remove_item(Number(l.id));
      }
    }

    const inclure_billet_links = await this.inclure_billet_repo.findAll();

    if (inclure_billet_links) {
      console.log("[INCLURE BILLETS LINKS FOUND] :", inclure_billet_links);
      for (const il of inclure_billet_links.filter((l) => String(l.code_billet) === String(id))) {
        console.log("[TRYING TO REMOVE]", id, "in", il);
        await this.inclure_billet_repo.remove_item(Number(il.id));
      }
    }

    const removed = await this.billet_repo.remove_item(parseInt(id));

    if (removed) {
      console.log("[BILLET REMOVED] : ", id);
      const all_voir_dino = await this.voir_dino_repo.findAll();
      res.status(200).send({ message: "billet removed !" });
      if (all_voir_dino) {
        const voir_dino_for_billet = all_voir_dino.filter((e) => e.code_billet === id);
        voir_dino_for_billet.forEach((e) =>
          this.voir_dino_repo.remove_item(parseInt(String(e.id)))
        );
      }
    } else {
      return res.status(400).send({ message: "an error occured" });
    }
  }

  static async tarif_upload_page(_: Request, res: Response) {
    res.render("admin/tarif_upload.ejs");
  }

  static async tarif_post(req: Request, res: Response) {
    try {
      const parsed_body = this.tarif_schema.parse(req.body);

      const tarif: TarifDTO = {
        titre_tarif: parsed_body.titre_tarif,
        coefficient_tarif: String(parsed_body.coefficient_tarif),
      };

      const tarif_entity = await this.tarif_repo.add_item(tarif);

      res.send({ message: tarif_entity });
    } catch (err) {
      console.error("[ERROR] : " + err);
      if (err instanceof z.ZodError) {
        return res.status(400).send({
          message: "Validation échouée",
          errors: err.issues,
          messages: err.issues.map((e) => e.message),
        });
      }
      return res.status(400).send({ message: err });
    }
  }

  static async remove_tarif(req: Request, res: Response) {
    console.log("[TRY TO REMOVE TARIF]");
    const id = req.params.id;

    if (!id) return res.status(404);

    try {
      const remove = await this.tarif_repo.remove_item(parseInt(id));
      if (!remove) {
        console.log("[FAILED TO REMOVE]");
        return res.status(404);
      }
      console.log("[TARIF REMOVED SUCCESSFULLY]");
      return res.status(200);
    } catch (err) {
      console.log("[ERROR REMOVING THE TARIF]", err);
      return res.status(500);
    }
  }
}
