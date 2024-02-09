"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_1 = require("../controllers/notification");
const permissions_1 = require("../middlewares/permissions");
const notificationRouter = express_1.default.Router();
notificationRouter.get("/", notification_1.getAllNotifications);
notificationRouter.get("/find/:id", notification_1.getNotification);
notificationRouter.post("/", permissions_1.checkAdminPermission, notification_1.createNotification);
notificationRouter.put("/:id", permissions_1.checkAdminPermission, notification_1.updateNotification);
notificationRouter.delete("/:id", permissions_1.checkAdminPermission, notification_1.deleteNotification);
exports.default = notificationRouter;
