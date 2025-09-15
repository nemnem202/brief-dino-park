import { Router } from "express";

const general_routes = Router();

general_routes.get("/", (_, res) => {
  console.log("[REQUEST] : home");
  res.render("home.ejs");
});

general_routes.get("/reservations", (_, res) => {
  res.render("reservation_page.ejs");
});
