import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification";
import { checkAdminPermission } from "../middlewares/permissions";

const notificationRouter = express.Router();

notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/find/:id", getNotification);
notificationRouter.post("/", checkAdminPermission, createNotification);
notificationRouter.put("/:id", checkAdminPermission, updateNotification);
notificationRouter.delete("/:id", checkAdminPermission, deleteNotification);

export default notificationRouter;
