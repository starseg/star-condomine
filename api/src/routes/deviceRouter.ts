import express from "express";
import {
  createDevice,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDeviceByLobby,
  getFilteredDevices,
} from "../controllers/device-controller";
import { getDeviceModels } from "../controllers/device-model-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const deviceRouter = express.Router();

deviceRouter.get("/", getAllDevices);
deviceRouter.get("/find/:id", getDevice);
deviceRouter.get("/lobby/:lobby", getDeviceByLobby);
deviceRouter.get("/filtered/:lobby", getFilteredDevices);
deviceRouter.get("/models", getDeviceModels);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id", checkAdminPermission, deleteDevice);

export default deviceRouter;
