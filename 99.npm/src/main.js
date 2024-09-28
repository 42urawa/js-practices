import express from "express";
import open from "open";
import { SurveyCLI } from "./surveyCLI.js";

const endTime = 5000;

const main = async () => {
  const surveyCLI = new SurveyCLI();

  const template = await surveyCLI.execute();

  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_, res) => {
    res.send(template);
  });

  const server = app.listen(port, () => {
    console.log(`Server is runnnin on port ${port}`);
    console.log(`"This will end in 5 seconds."`);
  });

  open(`http://localhost:${port}`);

  setTimeout(() => {
    server.close();
  }, endTime);
};

main();
