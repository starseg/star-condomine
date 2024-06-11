import express from "express";
import {
  createGroupAccessRule,
  deleteGroupAccessRule,
  getAllGroupAccessRules,
  getGroupAccessRule,
  updateGroupAccessRule,
} from "../controllers/groupAccessRule";
import { checkAdminPermission } from "../middlewares/permissions";

const groupAccessRuleRouter = express.Router();

groupAccessRuleRouter.get("/", getAllGroupAccessRules);
groupAccessRuleRouter.get("/find/:id", getGroupAccessRule);
groupAccessRuleRouter.post("/", createGroupAccessRule);
groupAccessRuleRouter.put("/:id", updateGroupAccessRule);
groupAccessRuleRouter.delete(
  "/:id",
  checkAdminPermission,
  deleteGroupAccessRule
);

export default groupAccessRuleRouter;
