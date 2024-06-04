import express from "express";
import {
  getAllBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/controllerBrand";
import { checkAdminPermission } from "../middlewares/permissions";

const brandRouter = express.Router();
brandRouter.get("/", getAllBrands);
brandRouter.get("/find/:id", getBrand);
brandRouter.post("/", createBrand);
brandRouter.put("/:id", updateBrand);
brandRouter.delete("/:id", checkAdminPermission, deleteBrand);

export default brandRouter;
