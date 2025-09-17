import { Request, Response } from "express";
import { BilletRepository } from "../repositories/billet_repository";
import DinoRepository from "../repositories/dino_repository";
import { DinosaureEntity } from "../types/models/dinosaure";
import { BilletEntity } from "../types/models/billet";
import { Voir_DinosaureEntity } from "../types/models/voir_dinosaure";
import { VoirDinoRepository } from "../repositories/voir_dino_repository";

export default class GeneralController {
  private static billet_repo = new BilletRepository();
  private static dino_repo = new DinoRepository();
  public static voir_dino_repo = new VoirDinoRepository();

  static async get_home_page(req: Request, res: Response) {
    if (req.user_id) {
      console.log("[USER] is connected", req.user_id);
    } else {
      console.log("[USER] is not connected");
    }

    const dinos: DinosaureEntity[] = (await this.dino_repo.findAll()) ?? [];
    const billets: BilletEntity[] = (await this.billet_repo.findAll()) ?? [];
    const voir_dino: Voir_DinosaureEntity[] = (await this.voir_dino_repo.findAll()) ?? [];

    res.render("home.ejs", { dinos: dinos, billets: billets, voir_dino: voir_dino });
  }

  static async get_reservation_page(req: Request, res: Response) {
    const billets: BilletEntity[] = (await this.billet_repo.findAll()) ?? [];
    res.render("reservation_page.ejs", { billets: billets });
  }
}
