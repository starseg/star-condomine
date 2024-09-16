import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createNotification,
  deleteNotification,
  getActiveNotifications,
  getAllNotifications,
  getNotification,
  updateNotification
} from "./chunk-PXWG5AJJ.mjs";

// src/routes/notificationRouter.ts
import express from "express";
var notificationRouter = express.Router();
notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/active", getActiveNotifications);
notificationRouter.get("/find/:id", getNotification);
notificationRouter.post("/", checkAdminPermission, createNotification);
notificationRouter.put("/:id", checkAdminPermission, updateNotification);
notificationRouter.delete("/:id", checkAdminPermission, deleteNotification);
var notificationRouter_default = notificationRouter;

export {
  notificationRouter_default
};
