import { Request, Response } from "express";
import z from "zod";
import { ReservationRepository } from "../repositories/reservation_repository";
import { InclureBilletRepository } from "../repositories/inclure_billet_repository";
import { ReservationDTO, ReservationENTITY } from "../types/models/reservation";
import { InclureBilletDTO } from "../types/models/inclure_billet";
import { BilletRepository } from "../repositories/billet_repository";
import Repository from "../libs/repository";
import { TarifRepository } from "../repositories/tarif_repository";

export default class UserController {
  private static reservation_repo = new ReservationRepository();
  private static inclure_billet_repo = new InclureBilletRepository();
  private static billet_repo = new BilletRepository();
  private static tarif_repo = new TarifRepository();

  private static achat_schema = z.array(
    z.object({
      billet_id: z.preprocess((val) => {
        if (typeof val === "number") return String(val);
        return val;
      }, z.string()),

      tarif_id: z.preprocess((val) => {
        if (typeof val === "number") return String(val);
        return val;
      }, z.string()),
    })
  );

  static async post_reservation(req: Request, res: Response) {
    console.log("[POST RESERVATION REQUIRED]");
    try {
      const request_body = this.achat_schema.parse(req.body.achats);
      const user = req.user_id;
      console.log("[REQUEST] :", request_body);
      console.log("[FROM] : ", user);

      if (!user) {
        return res.redirect("/connexion/login");
      }

      if (!request_body) {
        return res.send({ message: "no form submitted" }).status(500);
      }

      const reservation: ReservationDTO = {
        code_utilisateur: user,
        date_reservation: new Date(),
      };

      const reservation_entity = await this.reservation_repo.add_item(reservation);

      if (!reservation_entity) {
        console.log("[RESERVATION FAILED]");
        return res.send({ message: "an error occured" }).status(500);
      }

      const billets = await this.billet_repo.findAll();

      if (!billets) {
        console.log("[NO BILLETS]");
        return res.send({ message: "internal server error" }).status(500);
      }

      const tarifs = await this.tarif_repo.findAll();

      if (!tarifs) {
        console.log("[NO TARIFS]");
        return res.send({ message: "internal server error" }).status(500);
      }

      for (const rb of request_body) {
        const billet = billets.find((b) => String(b.id) === rb.billet_id);
        const tarif = tarifs.find((t) => String(t.id) === rb.tarif_id);

        if (!billet || !tarif) {
          console.log("[BILLET INCORRECT]");
          return res.send({ message: "billet incorrect" }).status(500);
        }

        const prix = Number(billet.prix_billet) * Number(tarif.coefficient_tarif);

        const inclure_billet: InclureBilletDTO = {
          code_reservation: reservation_entity.id,
          code_billet: rb.billet_id,
          code_tarif: rb.tarif_id,
          prix_a_l_achat: prix,
        };

        const new_billet = this.inclure_billet_repo.add_item(inclure_billet);

        if (!new_billet) {
          console.log("[ERROR NEW BILLET]");
          return res.send({ message: "internal error" }).status(500);
        }
      }
      res.redirect("/");
    } catch (err) {
      console.log("[ERROR IN RES POST]", err);
      return res.send({ message: "internal error" }).status(500);
    }
  }
}
