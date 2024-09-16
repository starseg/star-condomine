import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createAccessRule,
  deleteAccessRule,
  getAccessRule,
  getAccessRulesByLobby,
  getAllAccessRules,
  updateAccessRule
} from "./chunk-2JQF3GBM.mjs";

// src/routes/accessRuleRouter.ts
import express from "express";
var accessRuleRouter = express.Router();
accessRuleRouter.get("/", getAllAccessRules);
accessRuleRouter.get("/find/:id", getAccessRule);
accessRuleRouter.get("/lobby/:lobby", getAccessRulesByLobby);
accessRuleRouter.post("/", createAccessRule);
accessRuleRouter.put("/:id", updateAccessRule);
accessRuleRouter.delete("/:id", checkAdminPermission, deleteAccessRule);
var accessRuleRouter_default = accessRuleRouter;

export {
  accessRuleRouter_default
};
