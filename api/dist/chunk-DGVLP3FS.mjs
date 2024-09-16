import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createVisitor,
  deleteVisitor,
  getAllVisitors,
  getFilteredVisitors,
  getVisitor,
  getVisitorPhoto,
  getVisitorTypes,
  getVisitorsByLobby,
  updateVisitor
} from "./chunk-W22MSNNP.mjs";

// src/routes/visitorRouter.ts
import express from "express";
var visitorRouter = express.Router();
visitorRouter.get("/", getAllVisitors);
visitorRouter.get("/find/:id", getVisitor);
visitorRouter.get("/types", getVisitorTypes);
visitorRouter.get("/lobby/:lobby", getVisitorsByLobby);
visitorRouter.get("/filtered/:lobby", getFilteredVisitors);
visitorRouter.get("/find/:id/base64photo", getVisitorPhoto);
visitorRouter.post("/", createVisitor);
visitorRouter.put("/:id", updateVisitor);
visitorRouter.delete("/:id", checkAdminPermission, deleteVisitor);
var visitorRouter_default = visitorRouter;

export {
  visitorRouter_default
};
