import express from "express";
import {
  getDeviceModels,
  createDeviceModel,
  getDeviceModel,
  updateDeviceModel,
  deleteDeviceModel,
} from "../controllers/device-model-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const deviceModelRouter = express.Router();
deviceModelRouter.get("/", getDeviceModels);
deviceModelRouter.get("/find/:id", getDeviceModel);
deviceModelRouter.post("/", createDeviceModel);
deviceModelRouter.put("/:id", updateDeviceModel);
deviceModelRouter.delete("/:id", checkAdminPermission, deleteDeviceModel);

export default deviceModelRouter;
