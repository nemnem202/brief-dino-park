import { Router } from "express";

const routes_admin = Router();

routes_admin.get("/dino-upload", (_, res) => {
  res.render("admin/dinosaure_upload.ejs");
});

routes_admin.post("/dino-upload", (req, res) => {
  res.send(req.body);
});

routes_admin.get("/board", (req, res) => {
  res.render("board.ejs");
});

export default routes_admin;
