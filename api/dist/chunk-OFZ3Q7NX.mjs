import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createAreaAccessRule,
  deleteAreaAccessRule,
  getAllAreaAccessRules,
  getAreaAccessRule,
  updateAreaAccessRule
} from "./chunk-J5WZO7TA.mjs";

// src/routes/areaAccessRuleRouter.ts
import express from "express";
var areaAccessRuleRouter = express.Router();
areaAccessRuleRouter.get("/", getAllAreaAccessRules);
areaAccessRuleRouter.get("/find/:id", getAreaAccessRule);
areaAccessRuleRouter.post("/", createAreaAccessRule);
areaAccessRuleRouter.put("/:id", updateAreaAccessRule);
areaAccessRuleRouter.delete("/:id", checkAdminPermission, deleteAreaAccessRule);
var areaAccessRuleRouter_default = areaAccessRuleRouter;

export {
  areaAccessRuleRouter_default
};
