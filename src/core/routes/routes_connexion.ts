import { Router } from "express";
import ConnexionController from "../../controller/connexion_controller";
import multer from "multer";

const routes_connexion = Router();

routes_connexion.get("/sign-up", (_, res) => {
  res.render("sign_up.ejs");
});

routes_connexion.get("/sign-in", (_, res) => {
  res.render("sign_in.ejs");
});

routes_connexion.post("/sign-in", (req, res) => ConnexionController.sign_in(req, res));

export default routes_connexion;
