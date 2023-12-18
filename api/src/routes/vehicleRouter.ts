import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByOwner,
  getVehicleTypes,
} from "../controllers/vehicle";
import { checkAdminPermission } from "../middlewares/permissions";

const vehicleRouter = express.Router();

vehicleRouter.get("/", getAllVehicles);
vehicleRouter.get("/find/:id", getVehicle);
vehicleRouter.get("/member/:id", getVehiclesByOwner);
vehicleRouter.get("/types", getVehicleTypes);
vehicleRouter.post("/", createVehicle);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.delete("/:id", checkAdminPermission, deleteVehicle);

export default vehicleRouter;
