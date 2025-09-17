import { Request, Response } from "express";
import { z } from "zod";
import argon2 from "argon2";
import { Compte_utilisateurDTO } from "../types/models/compte_utilisateur";
import { UseRepository } from "../repositories/user_repository";
import CookieGen from "../libs/cookie_gen";

export default class ConnexionController {
  private static user_repo = new UseRepository();
  private static user_schema = z.object({
    email: z.email(),
    password: z.string(),
  });
  static async sign_in(req: Request, res: Response) {
    try {
      const parsed_body = this.user_schema.parse(req.body);

      parsed_body.password = await argon2.hash(parsed_body.password);

      const user: Compte_utilisateurDTO = {
        email: parsed_body.email,
        mot_de_passe: parsed_body.password,
        est_administrateur: false,
      };

      const user_entity = await this.user_repo.add_item(user);

      if (user_entity && user_entity.code_utilisateur) {
        const token = CookieGen.generate_user_token(user_entity.code_utilisateur);
        if (!token) return;
        res
          .cookie("user_token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
          })
          .send({ message: user_entity.code_utilisateur, redirect: "/" });
      } else {
        res.status(500).send({ message: "an error occured" });
      }
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
}
