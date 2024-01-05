"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduling_1 = require("../controllers/scheduling");
const permissions_1 = require("../middlewares/permissions");
const schedulingRouter = express_1.default.Router();
schedulingRouter.get("/", scheduling_1.getAllSchedules);
schedulingRouter.get("/find/:id", scheduling_1.getScheduling);
schedulingRouter.get("/lobby/:lobby", scheduling_1.getSchedulingsByLobby);
schedulingRouter.get("/filtered/:lobby", scheduling_1.getFilteredSchedulings);
schedulingRouter.post("/", scheduling_1.createScheduling);
schedulingRouter.put("/:id", scheduling_1.updateScheduling);
schedulingRouter.delete("/:id", permissions_1.checkAdminPermission, scheduling_1.deleteScheduling);
exports.default = schedulingRouter;
