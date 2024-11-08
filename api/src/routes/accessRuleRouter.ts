import express from "express";
import {
  createAccessRule,
  deleteAccessRule,
  getAllAccessRules,
  getAccessRule,
  updateAccessRule,
  getAccessRulesByLobby,
} from "../controllers/access-rule-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRuleRouter = express.Router();

accessRuleRouter.get("/", getAllAccessRules);
accessRuleRouter.get("/find/:id", getAccessRule);
accessRuleRouter.get("/lobby/:lobby", getAccessRulesByLobby);
accessRuleRouter.post("/", createAccessRule);
accessRuleRouter.put("/:id", updateAccessRule);
accessRuleRouter.delete("/:id", checkAdminPermission, deleteAccessRule);

export default accessRuleRouter;
