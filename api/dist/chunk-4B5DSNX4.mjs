import {
  accessesByLobby,
  accessesByOperator,
  count,
  countAccessesPerHour,
  problemsByLobby
} from "./chunk-7NYOTFRW.mjs";

// src/routes/generalDataRouter.ts
import express from "express";
var generalDataRouter = express.Router();
generalDataRouter.get("/count", count);
generalDataRouter.get("/accessesByLobby", accessesByLobby);
generalDataRouter.get("/problemsByLobby", problemsByLobby);
generalDataRouter.get("/accessesByOperator", accessesByOperator);
generalDataRouter.get("/countAccessesPerHour", countAccessesPerHour);
var generalDataRouter_default = generalDataRouter;

export {
  generalDataRouter_default
};
