import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createTimeSpan,
  deleteTimeSpan,
  getAllTimeSpans,
  getTimeSpan,
  getTimeSpansByLobby,
  updateTimeSpan
} from "./chunk-QG6Q6HYV.mjs";

// src/routes/timeSpanRouter.ts
import express from "express";
var timeSpanRouter = express.Router();
timeSpanRouter.get("/", getAllTimeSpans);
timeSpanRouter.get("/find/:id", getTimeSpan);
timeSpanRouter.get("/lobby/:lobby", getTimeSpansByLobby);
timeSpanRouter.post("/", createTimeSpan);
timeSpanRouter.put("/:id", updateTimeSpan);
timeSpanRouter.delete("/:id", checkAdminPermission, deleteTimeSpan);
var timeSpanRouter_default = timeSpanRouter;

export {
  timeSpanRouter_default
};
