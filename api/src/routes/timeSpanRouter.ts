import express from "express";
import {
  createTimeSpan,
  getAllTimeSpans,
  getTimeSpan,
  updateTimeSpan,
  deleteTimeSpan,
} from "../controllers/timeSpan";
import { checkAdminPermission } from "../middlewares/permissions";

const timeSpanRouter = express.Router();

timeSpanRouter.get("/", getAllTimeSpans);
timeSpanRouter.get("/find/:id", getTimeSpan);
timeSpanRouter.post("/", createTimeSpan);
timeSpanRouter.put("/:id", updateTimeSpan);
timeSpanRouter.delete("/:id", checkAdminPermission, deleteTimeSpan);

export default timeSpanRouter;
