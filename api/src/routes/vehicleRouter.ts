import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle";

const vehicleRouter = express.Router();

vehicleRouter.get("/", getAllVehicles);
vehicleRouter.get("/:id", getVehicle);
vehicleRouter.post("/", createVehicle);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.delete("/:id", deleteVehicle);

export default vehicleRouter;
