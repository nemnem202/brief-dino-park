import { Router } from "express";
import routes_connexion from "./routes/routes_connexion";
import routes_user from "./routes/routes_user";
import routes_admin from "./routes/routes_admin";
import general_routes from "./routes/routes_general";

const router = Router();

router.use("/connexion", routes_connexion);

router.use("/user", routes_user);

router.use("", general_routes);

router.use("/admin", routes_admin);

router.use((_, res) => {
  res.render("not_found.ejs");
});

export default router;
