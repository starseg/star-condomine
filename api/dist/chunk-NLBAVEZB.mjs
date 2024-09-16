import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createGroupAccessRule,
  deleteGroupAccessRule,
  getAllGroupAccessRules,
  getGroupAccessRule,
  getGroupAccessRulesByLobby,
  updateGroupAccessRule
} from "./chunk-E6ACWUJ6.mjs";

// src/routes/groupAccessRuleRouter.ts
import express from "express";
var groupAccessRuleRouter = express.Router();
groupAccessRuleRouter.get("/", getAllGroupAccessRules);
groupAccessRuleRouter.get("/find/:id", getGroupAccessRule);
groupAccessRuleRouter.get("/lobby/:lobby", getGroupAccessRulesByLobby);
groupAccessRuleRouter.post("/", createGroupAccessRule);
groupAccessRuleRouter.put("/:id", updateGroupAccessRule);
groupAccessRuleRouter.delete(
  "/:id",
  checkAdminPermission,
  deleteGroupAccessRule
);
var groupAccessRuleRouter_default = groupAccessRuleRouter;

export {
  groupAccessRuleRouter_default
};
