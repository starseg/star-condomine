import {
  createVisitorGroup,
  deleteVisitorGroup,
  getAllVisitorGroups,
  getVisitorGroup,
  getVisitorGroupsByLobby,
  updateVisitorGroup
} from "./chunk-V7FQ4JXC.mjs";
import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";

// src/routes/visitorGroupRouter.ts
import express from "express";
var visitorGroupRouter = express.Router();
visitorGroupRouter.get("/", getAllVisitorGroups);
visitorGroupRouter.get("/find/:id", getVisitorGroup);
visitorGroupRouter.get("/lobby/:lobby", getVisitorGroupsByLobby);
visitorGroupRouter.post("/", createVisitorGroup);
visitorGroupRouter.put("/:id", updateVisitorGroup);
visitorGroupRouter.delete("/:id", checkAdminPermission, deleteVisitorGroup);
var visitorGroupRouter_default = visitorGroupRouter;

export {
  visitorGroupRouter_default
};
