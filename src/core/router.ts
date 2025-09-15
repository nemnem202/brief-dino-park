import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  console.log("[REQUEST] : home");
  res.render("home.ejs");
});

router.get("/board", (req, res) => {
  res.render("board.ejs");
});

router.get("/reservations", (_, res) => {
  res.render("reservation_page.ejs");
});

router.get("/reservations/:reservation_id", (req, res) => {
  res.redirect("/payment/" + req.params.reservation_id);
});

router.get("/payment/:reservation_id", (req, res) => {
  res.render("payment.ejs", { reservation_id: req.params.reservation_id });
});

router.get("/sign-up", (_, res) => {
  res.render("sign_up.ejs");
});

router.get("/sign-in", (_, res) => {
  res.render("sign_in.ejs");
});

router.get("/admin/dino-upload", (_, res) => {
  res.render("admin/dinosaure_upload.ejs");
});

router.use((_, res) => {
  res.render("not_found.ejs");
});

export default router;
