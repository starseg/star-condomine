import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle";
import { checkAdminPermission } from "../middlewares/permissions";

const vehicleRouter = express.Router();

vehicleRouter.get("/", getAllVehicles);
vehicleRouter.get("/:id", getVehicle);
vehicleRouter.post("/", createVehicle);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.delete("/:id", checkAdminPermission, deleteVehicle);

export default vehicleRouter;
