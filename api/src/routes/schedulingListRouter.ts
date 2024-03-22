import express from "express";
import {
  createSchedulingList,
  getAllSchedulingLists,
  getSchedulingList,
  updateSchedulingList,
  deleteSchedulingList,
  getFilteredSchedulingLists,
} from "../controllers/schedulingList";
import { checkAdminPermission } from "../middlewares/permissions";

const schedulingListRouter = express.Router();

schedulingListRouter.get("/", getAllSchedulingLists);
schedulingListRouter.get("/find/:id", getSchedulingList);
schedulingListRouter.get("/filtered/:lobby", getFilteredSchedulingLists);
schedulingListRouter.post("/", createSchedulingList);
schedulingListRouter.put("/:id", updateSchedulingList);
schedulingListRouter.delete("/:id", checkAdminPermission, deleteSchedulingList);

export default schedulingListRouter;
