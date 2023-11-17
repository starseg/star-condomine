import express from "express";
import {
  createDevice,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice
} from "../controllers/device";
import { checkAdminPermission } from "../middlewares/permissions";

const deviceRouter = express.Router();

deviceRouter.get("/", getAllDevices);
deviceRouter.get("/:id", getDevice);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id",checkAdminPermission, deleteDevice);

export default deviceRouter;
