import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getFilteredVehicles,
  getVehicle,
  getVehicleTypes,
  getVehiclesByLobby,
  getVehiclesByOwner,
  updateVehicle
} from "./chunk-OVDLKTAO.mjs";

// src/routes/vehicleRouter.ts
import express from "express";
var vehicleRouter = express.Router();
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.get("/find/:id", getVehicle);
vehicleRouter.get("/member/:id", getVehiclesByOwner);
vehicleRouter.get("/lobby/:lobby", getVehiclesByLobby);
vehicleRouter.get("/types", getVehicleTypes);
vehicleRouter.get("/filtered/:lobby", getFilteredVehicles);
vehicleRouter.post("/", createVehicle);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.delete("/:id", checkAdminPermission, deleteVehicle);
var vehicleRouter_default = vehicleRouter;

export {
  vehicleRouter_default
};
