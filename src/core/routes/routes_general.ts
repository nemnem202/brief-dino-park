import { Router } from "express";
import { MiddleWare } from "../../libs/middleware";

const general_routes = Router();

general_routes.get(
  "/",
  (req, res, next) => MiddleWare.check_user_auth(req, res, next),
  (req, res) => {
    if (req.user_id) {
      console.log("[USER] is connected", req.user_id);
    }
    console.log("[REQUEST] : home");
    res.render("home.ejs");
  }
);

general_routes.get("/reservations", (_, res) => {
  res.render("reservation_page.ejs");
});

export default general_routes;
