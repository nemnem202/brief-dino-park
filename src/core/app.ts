import { Express } from "express";
import express from "express";
import { Database } from "./db";

const app: Express = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, Dino Park!");
});

const init_database = async () => {
  const db = Database.getInstance();

  await db.user.createMany({
    data: [{ email: "oseose", name: "john" }],
  });

  const users = await db.user.findMany();

  console.log(users);
};

init_database();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
