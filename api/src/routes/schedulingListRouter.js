"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedulingList_1 = require("../controllers/schedulingList");
const permissions_1 = require("../middlewares/permissions");
const schedulingListRouter = express_1.default.Router();
schedulingListRouter.get("/", schedulingList_1.getAllSchedulingLists);
schedulingListRouter.get("/find/:id", schedulingList_1.getSchedulingList);
schedulingListRouter.get("/filtered", schedulingList_1.getFilteredSchedulingLists);
schedulingListRouter.post("/", schedulingList_1.createSchedulingList);
schedulingListRouter.put("/:id", schedulingList_1.updateSchedulingList);
schedulingListRouter.delete("/:id", permissions_1.checkAdminPermission, schedulingList_1.deleteSchedulingList);
exports.default = schedulingListRouter;
