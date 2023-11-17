import express from "express";
import {
  createScheduling,
  getAllSchedules,
  getScheduling,
  updateScheduling,
  deleteScheduling
} from "../controllers/scheduling";
import { checkAdminPermission } from "../middlewares/permissions";

const schedulingRouter = express.Router();

schedulingRouter.get("/", getAllSchedules);
schedulingRouter.get("/:id", getScheduling);
schedulingRouter.post("/", createScheduling);
schedulingRouter.put("/:id", updateScheduling);
schedulingRouter.delete("/:id", checkAdminPermission, deleteScheduling);

export default schedulingRouter;
