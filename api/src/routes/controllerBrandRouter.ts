import express from "express";
import {
  getAllDeviceBrands,
  getDeviceBrand,
  createDeviceBrand,
  updateDeviceBrand,
  deleteDeviceBrand,
} from "../controllers/device-brand-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const brandRouter = express.Router();
brandRouter.get("/", getAllDeviceBrands);
brandRouter.get("/find/:id", getDeviceBrand);
brandRouter.post("/", createDeviceBrand);
brandRouter.put("/:id", updateDeviceBrand);
brandRouter.delete("/:id", checkAdminPermission, deleteDeviceBrand);

export default brandRouter;
