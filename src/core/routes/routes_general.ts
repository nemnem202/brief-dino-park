import { Router } from "express";
import { MiddleWare } from "../../libs/middleware";
import GeneralController from "../../controller/general_controller";

const general_routes = Router();

general_routes.get(
  "/",
  (req, res, next) => MiddleWare.check_user_auth(req, res, next),
  (req, res) => GeneralController.get_home_page(req, res)
);

general_routes.get("/reservations", (req, res) => GeneralController.get_reservation_page(req, res));

general_routes.get("/available-tarifs", (req, res) =>
  GeneralController.get_available_tarifs(req, res)
);

export default general_routes;
