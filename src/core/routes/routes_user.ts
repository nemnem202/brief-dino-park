import { Router } from "express";

const routes_user = Router();

routes_user.get("/reservations/:reservation_id", (req, res) => {
  res.redirect("/payment/" + req.params.reservation_id);
});

routes_user.get("/payment/:reservation_id", (req, res) => {
  res.render("payment.ejs", { reservation_id: req.params.reservation_id });
});

export default routes_user;
