import express from "express";
import {
  createTimeZone,
  getAllTimeZones,
  getTimeZone,
  updateTimeZone,
  deleteTimeZone,
} from "../controllers/timeZone";
import { checkAdminPermission } from "../middlewares/permissions";

const timeZoneRouter = express.Router();

timeZoneRouter.get("/", getAllTimeZones);
timeZoneRouter.get("/find/:id", getTimeZone);
timeZoneRouter.post("/", createTimeZone);
timeZoneRouter.put("/:id", updateTimeZone);
timeZoneRouter.delete("/:id", checkAdminPermission, deleteTimeZone);

export default timeZoneRouter;
