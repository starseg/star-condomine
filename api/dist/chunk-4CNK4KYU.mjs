import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createDeviceModel,
  deleteDeviceModel,
  getDeviceModel,
  getDeviceModels,
  updateDeviceModel
} from "./chunk-RPSIJF36.mjs";

// src/routes/deviceModelRouter.ts
import express from "express";
var deviceModelRouter = express.Router();
deviceModelRouter.get("/", getDeviceModels);
deviceModelRouter.get("/find/:id", getDeviceModel);
deviceModelRouter.post("/", createDeviceModel);
deviceModelRouter.put("/:id", updateDeviceModel);
deviceModelRouter.delete("/:id", checkAdminPermission, deleteDeviceModel);
var deviceModelRouter_default = deviceModelRouter;

export {
  deviceModelRouter_default
};
