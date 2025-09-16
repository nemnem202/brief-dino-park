import { Router } from "express";
import AdminController from "../../controller/admin_controller";
import "dotenv/config";
import { MiddleWare } from "../../libs/middleware";
import multer from "multer";

const routes_admin = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes_admin.get(`/dino-upload/${process.env.GATEWAY_CODE}`, (_, res) =>
  AdminController.dino_upload_page(_, res)
);

routes_admin.post(
  "/dino-upload",
  (req, res, next) => MiddleWare.check_admin_auth(req, res, next),
  upload.single("dinosaure_img"),
  (req, res) => AdminController.dino_post(req, res)
);

routes_admin.get("/board", (req, res) => {
  res.render("board.ejs");
});

export default routes_admin;
