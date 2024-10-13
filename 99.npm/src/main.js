#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import open from "open";
import { SurveyCLI } from "./surveyCLI.js";

const endTime = 5000;

const main = async () => {
  const surveyCLI = new SurveyCLI();

  const {
    city,
    baseYear,
    targetYear,
    month,
    label,
    baseHighestTemperatures,
    baseAverageTemperatures,
    baseLowestTemperatures,
    targetHighestTemperatures,
    targetAverageTemperatures,
    targetLowestTemperatures,
    averageOfBaseHighestTemperatures,
    averageOfBaseAverageTemperatures,
    averageOfBaseLowestTemperatures,
    averageOfTargetHighestTemperatures,
    averageOfTargetAverageTemperatures,
    averageOfTargetLowestTemperatures,
  } = await surveyCLI.execute();

  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set("view engine", "pug");

  const filePath = fileURLToPath(import.meta.url);
  const fileDir = path.dirname(filePath);
  const templateFilePath = path.join(fileDir, "/views");

  app.set("views", templateFilePath);

  app.get("/", (_, res) => {
    res.render("index", {
      city,
      baseYear,
      targetYear,
      month,
      label: label.join(","),
      baseHighestTemperatures: baseHighestTemperatures.join(","),
      baseAverageTemperatures: baseAverageTemperatures.join(","),
      baseLowestTemperatures: baseLowestTemperatures.join(","),
      targetHighestTemperatures: targetHighestTemperatures.join(","),
      targetAverageTemperatures: targetAverageTemperatures.join(","),
      targetLowestTemperatures: targetLowestTemperatures.join(","),
      averageOfBaseHighestTemperatures,
      averageOfBaseAverageTemperatures,
      averageOfBaseLowestTemperatures,
      averageOfTargetHighestTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfTargetLowestTemperatures,
    });
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
