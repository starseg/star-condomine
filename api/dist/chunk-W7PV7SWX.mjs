import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createAccess,
  deleteAccess,
  generateReport,
  getAccess,
  getAccessByLobby,
  getAllAccess,
  getFilteredAccess,
  updateAccess
} from "./chunk-JYFV5C2R.mjs";

// src/routes/accessRouter.ts
import express from "express";
var accessRouter = express.Router();
accessRouter.get("/", getAllAccess);
accessRouter.get("/find/:id", getAccess);
accessRouter.get("/lobby/:lobby", getAccessByLobby);
accessRouter.get("/filtered/:lobby", getFilteredAccess);
accessRouter.get("/report/:lobby", generateReport);
accessRouter.post("/", createAccess);
accessRouter.put("/:id", updateAccess);
accessRouter.delete("/:id", checkAdminPermission, deleteAccess);
var accessRouter_default = accessRouter;

export {
  accessRouter_default
};
