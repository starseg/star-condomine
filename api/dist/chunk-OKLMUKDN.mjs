import {
  addCommand,
  clearResults,
  push,
  result,
  results
} from "./chunk-BAXCZ7AV.mjs";

// src/routes/controliDRouter.ts
import express from "express";
var controliDRouter = express.Router();
controliDRouter.get("/push", push);
controliDRouter.post("/result", result);
controliDRouter.post("/add-command", addCommand);
controliDRouter.get("/results", results);
controliDRouter.get("/clearResults", clearResults);
var controliDRouter_default = controliDRouter;

export {
  controliDRouter_default
};
