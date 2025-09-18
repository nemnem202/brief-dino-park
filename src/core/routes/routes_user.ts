import { Router } from "express";
import UserController from "../../controller/user_controller";
import { MiddleWare } from "../../libs/middleware";

const routes_user = Router();

routes_user.post(
  "/payment",
  (req, res, next) => MiddleWare.check_user_auth(req, res, next),
  (req, res) => {
    UserController.post_reservation(req, res);
  }
);

export default routes_user;
