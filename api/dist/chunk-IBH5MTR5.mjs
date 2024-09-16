import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createDevice,
  deleteDevice,
  getAllDevices,
  getDevice,
  getDeviceByLobby,
  getDeviceModels,
  getFilteredDevices,
  updateDevice
} from "./chunk-Q5KE3UIO.mjs";

// src/routes/deviceRouter.ts
import express from "express";
var deviceRouter = express.Router();
deviceRouter.get("/", getAllDevices);
deviceRouter.get("/find/:id", getDevice);
deviceRouter.get("/lobby/:lobby", getDeviceByLobby);
deviceRouter.get("/filtered/:lobby", getFilteredDevices);
deviceRouter.get("/models", getDeviceModels);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id", checkAdminPermission, deleteDevice);
var deviceRouter_default = deviceRouter;

export {
  deviceRouter_default
};
