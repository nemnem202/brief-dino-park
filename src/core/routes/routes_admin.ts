import { Router } from "express";
import AdminController from "../../controller/admin_controller";
import "dotenv/config";

const routes_admin = Router();

routes_admin.get(`/dino-upload/${process.env.GATEWAY_CODE}`, (_, res) =>
  AdminController.dino_upload_page(_, res)
);

routes_admin.post(
  "/dino-upload",
  (req, res, next) => AdminController.chechAuth(req, res, next),
  (req, res) => AdminController.dino_post(req, res)
);

routes_admin.get("/board", (req, res) => {
  res.render("board.ejs");
});

export default routes_admin;
