import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createAccessRuleTimeZone,
  deleteAccessRuleTimeZone,
  getAccessRuleTimeZone,
  getAccessRuleTimeZonesByLobby,
  getAllAccessRuleTimeZones,
  updateAccessRuleTimeZone
} from "./chunk-FADTVDDG.mjs";

// src/routes/accessRuleTimeZoneRouter.ts
import express from "express";
var accessRuleTimeZoneRouter = express.Router();
accessRuleTimeZoneRouter.get("/", getAllAccessRuleTimeZones);
accessRuleTimeZoneRouter.get("/find/:id", getAccessRuleTimeZone);
accessRuleTimeZoneRouter.get("/lobby/:lobby", getAccessRuleTimeZonesByLobby);
accessRuleTimeZoneRouter.post("/", createAccessRuleTimeZone);
accessRuleTimeZoneRouter.put("/:id", updateAccessRuleTimeZone);
accessRuleTimeZoneRouter.delete(
  "/:id",
  checkAdminPermission,
  deleteAccessRuleTimeZone
);
var accessRuleTimeZoneRouter_default = accessRuleTimeZoneRouter;

export {
  accessRuleTimeZoneRouter_default
};
