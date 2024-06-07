"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeSpan_1 = require("../controllers/timeSpan");
const permissions_1 = require("../middlewares/permissions");
const timeSpanRouter = express_1.default.Router();
timeSpanRouter.get("/", timeSpan_1.getAllTimeSpans);
timeSpanRouter.get("/find/:id", timeSpan_1.getTimeSpan);
timeSpanRouter.post("/", timeSpan_1.createTimeSpan);
timeSpanRouter.put("/:id", timeSpan_1.updateTimeSpan);
timeSpanRouter.delete("/:id", permissions_1.checkAdminPermission, timeSpan_1.deleteTimeSpan);
exports.default = timeSpanRouter;
