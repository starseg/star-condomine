import express from "express";
import {
  createDevice,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice
} from "../controllers/device";

const deviceRouter = express.Router();

deviceRouter.get("/", getAllDevices);
deviceRouter.get("/:id", getDevice);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id", deleteDevice);

export default deviceRouter;
