import express from "express";
import {
  createAreaAccessRule,
  deleteAreaAccessRule,
  getAllAreaAccessRules,
  getAreaAccessRule,
  updateAreaAccessRule,
} from "../controllers/areaAccessRule";
import { checkAdminPermission } from "../middlewares/permissions";

const areaAccessRuleRouter = express.Router();

areaAccessRuleRouter.get("/", getAllAreaAccessRules);
areaAccessRuleRouter.get("/find/:id", getAreaAccessRule);
areaAccessRuleRouter.post("/", createAreaAccessRule);
areaAccessRuleRouter.put("/:id", updateAreaAccessRule);
areaAccessRuleRouter.delete("/:id", checkAdminPermission, deleteAreaAccessRule);

export default areaAccessRuleRouter;
