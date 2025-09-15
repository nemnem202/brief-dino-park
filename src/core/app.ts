import { Express } from "express";
import express from "express";
import router from "./router";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(router);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/pages"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
