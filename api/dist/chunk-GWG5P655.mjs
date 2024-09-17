import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createScheduling,
  deleteScheduling,
  getActiveSchedulingsByVisitor,
  getAllSchedules,
  getFilteredSchedulings,
  getScheduling,
  getSchedulingsByLobby,
  updateScheduling
} from "./chunk-LRECTTLD.mjs";

// src/routes/schedulingRouter.ts
import express from "express";
var schedulingRouter = express.Router();
schedulingRouter.get("/", getAllSchedules);
schedulingRouter.get("/find/:id", getScheduling);
schedulingRouter.get("/lobby/:lobby", getSchedulingsByLobby);
schedulingRouter.get("/filtered/:lobby", getFilteredSchedulings);
schedulingRouter.get("/active/:visitor", getActiveSchedulingsByVisitor);
schedulingRouter.post("/", createScheduling);
schedulingRouter.put("/:id", updateScheduling);
schedulingRouter.delete("/:id", checkAdminPermission, deleteScheduling);
var schedulingRouter_default = schedulingRouter;

export {
  schedulingRouter_default
};
