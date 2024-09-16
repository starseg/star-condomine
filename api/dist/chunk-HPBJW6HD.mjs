import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand
} from "./chunk-N3NYV6JB.mjs";

// src/routes/controllerBrandRouter.ts
import express from "express";
var brandRouter = express.Router();
brandRouter.get("/", getAllBrands);
brandRouter.get("/find/:id", getBrand);
brandRouter.post("/", createBrand);
brandRouter.put("/:id", updateBrand);
brandRouter.delete("/:id", checkAdminPermission, deleteBrand);
var controllerBrandRouter_default = brandRouter;

export {
  controllerBrandRouter_default
};
