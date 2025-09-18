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
  static async sign_up(req: Request, res: Response) {
    try {
      const parsed_body = this.user_schema.parse(req.body);

      console.log("[SIGN_UP] Tentative d’inscription pour :", parsed_body.email);

      // Hash du mot de passe
      const hashedPassword = await argon2.hash(parsed_body.password);

      const newUser: Compte_utilisateurDTO = {
        email: parsed_body.email,
        mot_de_passe: hashedPassword,
        est_administrateur: false,
      };

      const user_entity = await this.user_repo.add_item(newUser);

      if (!user_entity || !user_entity.id) {
        console.error("[SIGN_UP] Erreur lors de la création en DB");
        return res.status(500).send({ message: "Impossible de créer le compte" });
      }

      console.log("[SIGN_UP] Utilisateur créé avec ID :", user_entity.id);

      const token = CookieGen.generate_user_token(user_entity.id);

      if (!token) {
        console.error("[SIGN_UP] Impossible de générer un token");
        return res.status(500).send({ message: "Erreur serveur" });
      }

      res
        .cookie("user_token", token, {
          httpOnly: true,
          secure: false, // ⚠️ mets true si tu passes en HTTPS
          maxAge: 1000 * 60 * 60,
        })
        .status(201)
        .send({ message: "Compte créé", redirect: "/" });
    } catch (err) {
      console.error("[SIGN_UP] Erreur :", err);

      if (err instanceof z.ZodError) {
        return res.status(400).send({
          message: "Validation échouée",
          errors: err.issues,
        });
      }

      return res.status(500).send({ message: "Erreur serveur" });
    }
  }

  static async sign_in(req: Request, res: Response) {
    try {
      const parsed_body = this.user_schema.parse(req.body);

      console.log("[SIGN_IN] Tentative de connexion :", parsed_body.email);

      const users = await this.user_repo.findAll();
      if (!users) {
        console.error("[SIGN_IN] Impossible de récupérer les utilisateurs");
        return res.status(500).send({ message: "Erreur serveur" });
      }

      const target = users.find((u) => u.email === parsed_body.email);

      if (!target) {
        console.warn("[SIGN_IN] Email non trouvé :", parsed_body.email);
        return res.status(404).send({ message: "Utilisateur non trouvé" });
      }

      const auth = await argon2.verify(target.mot_de_passe, parsed_body.password);

      if (!auth) {
        console.warn("[SIGN_IN] Mot de passe invalide pour :", parsed_body.email);
        return res.status(401).send({ message: "Identifiants incorrects" });
      }

      console.log("[SIGN_IN] Authentification réussie pour :", target.id);

      const token = CookieGen.generate_user_token(target.id);

      if (!token) {
        console.error("[SIGN_IN] Impossible de générer un token");
        return res.status(500).send({ message: "Erreur serveur" });
      }

      res
        .cookie("user_token", token, {
          httpOnly: true,
          secure: false, // ⚠️ mets true si HTTPS
          maxAge: 1000 * 60 * 60,
        })
        .send({ message: "Connexion réussie", redirect: "/" });
    } catch (err) {
      console.error("[SIGN_IN] Erreur :", err);

      if (err instanceof z.ZodError) {
        return res.status(400).send({
          message: "Validation échouée",
          errors: err.issues,
        });
      }

      return res.status(500).send({ message: "Erreur serveur" });
    }
  }
}
