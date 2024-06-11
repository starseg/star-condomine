import express from "express";
import {
  createAccessRule,
  deleteAccessRule,
  getAllAccessRules,
  getAccessRule,
  updateAccessRule,
} from "../controllers/accessRule";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRuleRouter = express.Router();

accessRuleRouter.get("/", getAllAccessRules);
accessRuleRouter.get("/find/:id", getAccessRule);
accessRuleRouter.post("/", createAccessRule);
accessRuleRouter.put("/:id", updateAccessRule);
accessRuleRouter.delete("/:id", checkAdminPermission, deleteAccessRule);

export default accessRuleRouter;
