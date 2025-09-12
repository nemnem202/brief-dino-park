import { Express } from "express";
import express from "express";
import router from "./router";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
