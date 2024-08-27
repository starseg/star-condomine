import express from "express";
import {
  createAccessRuleTimeZone,
  deleteAccessRuleTimeZone,
  getAllAccessRuleTimeZones,
  getAccessRuleTimeZone,
  getAccessRuleTimeZonesByLobby,
  updateAccessRuleTimeZone,
} from "../controllers/accessRuleTimeZone";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRuleTimeZoneRouter = express.Router();

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

export default accessRuleTimeZoneRouter;
