import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createTimeZone,
  deleteTimeZone,
  getAllTimeZones,
  getTimeZone,
  getTimeZonesByLobby,
  updateTimeZone
} from "./chunk-6KHMAFSH.mjs";

// src/routes/timeZoneRouter.ts
import express from "express";
var timeZoneRouter = express.Router();
timeZoneRouter.get("/", getAllTimeZones);
timeZoneRouter.get("/find/:id", getTimeZone);
timeZoneRouter.get("/lobby/:lobby", getTimeZonesByLobby);
timeZoneRouter.post("/", createTimeZone);
timeZoneRouter.put("/:id", updateTimeZone);
timeZoneRouter.delete("/:id", checkAdminPermission, deleteTimeZone);
var timeZoneRouter_default = timeZoneRouter;

export {
  timeZoneRouter_default
};
