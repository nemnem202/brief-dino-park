import { Router } from "express";

const routes_connexion = Router();

routes_connexion.get("/sign-up", (_, res) => {
  res.render("sign_up.ejs");
});

routes_connexion.get("/sign-in", (_, res) => {
  res.render("sign_in.ejs");
});

export default routes_connexion;
