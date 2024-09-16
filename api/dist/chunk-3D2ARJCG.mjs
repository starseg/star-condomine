import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createSchedulingList,
  deleteSchedulingList,
  getAllSchedulingLists,
  getFilteredSchedulingLists,
  getSchedulingList,
  updateSchedulingList
} from "./chunk-O6QQWDK7.mjs";

// src/routes/schedulingListRouter.ts
import express from "express";
var schedulingListRouter = express.Router();
schedulingListRouter.get("/", getAllSchedulingLists);
schedulingListRouter.get("/find/:id", getSchedulingList);
schedulingListRouter.get("/filtered", getFilteredSchedulingLists);
schedulingListRouter.post("/", createSchedulingList);
schedulingListRouter.put("/:id", updateSchedulingList);
schedulingListRouter.delete("/:id", checkAdminPermission, deleteSchedulingList);
var schedulingListRouter_default = schedulingListRouter;

export {
  schedulingListRouter_default
};
