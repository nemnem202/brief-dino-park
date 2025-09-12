import { Express } from "express";
import express from "express";
import router from "./router";

const app: Express = express();
const port = 3000;

app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
