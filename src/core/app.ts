import { Express } from "express";
import express from "express";
import router from "./router";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 🔑 Sert le dossier public pour les fichiers statiques
const staticPath = path.join(__dirname, "../../public");
console.log("Trying to serve static from:", staticPath);
console.log("Exists?", fs.existsSync(staticPath));
app.use(express.static(staticPath)); // <-- c’est ça qui manquait

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Router et vues
app.use(router);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/pages"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
