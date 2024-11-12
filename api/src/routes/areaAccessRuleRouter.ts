import express from "express";
import {
  createAccessRuleArea,
  deleteAccessRuleArea,
  getAllAccessRuleAreas,
  getAccessRuleArea,
  updateAccessRuleArea
} from "../controllers/access-rule-area-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const areaAccessRuleRouter = express.Router();

areaAccessRuleRouter.get("/", getAllAccessRuleAreas);
areaAccessRuleRouter.get("/find/:id", getAccessRuleArea);
areaAccessRuleRouter.post("/", createAccessRuleArea);
areaAccessRuleRouter.put("/:id", updateAccessRuleArea);
areaAccessRuleRouter.delete("/:id", checkAdminPermission, deleteAccessRuleArea);

export default areaAccessRuleRouter;
