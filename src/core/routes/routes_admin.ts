import { Router } from "express";
import AdminController from "../../controller/admin_controller";
import "dotenv/config";
import { MiddleWare } from "../../libs/middleware";
import multer from "multer";

const routes_admin = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes_admin.get(
  `/dino-upload`,
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  (_, res) => AdminController.dino_upload_page(_, res)
);

routes_admin.get(`/gateway/${process.env.GATEWAY_CODE}`, (req, res) =>
  AdminController.get_gateway_cookie(req, res)
);

routes_admin.post(
  "/dino-upload",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  upload.single("dinosaure_img"),
  (req, res) => AdminController.dino_post(req, res)
);

routes_admin.get(
  "/board",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  (_, res) => AdminController.board_page(_, res)
);

routes_admin.get(
  "/remove_dino/:id",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  (req, res) => AdminController.remove_dino(req, res)
);

routes_admin.get(
  "/billet-upload",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  (req, res) => AdminController.billet_upload_page(req, res)
);

routes_admin.post(
  "/billet-upload",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  upload.single("billet_img"),
  (req, res) => AdminController.billet_post(req, res)
);

routes_admin.get(
  "/remove_billet/:id",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  (req, res) => AdminController.remove_billet(req, res)
);

export default routes_admin;
