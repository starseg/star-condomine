"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeZone_1 = require("../controllers/timeZone");
const permissions_1 = require("../middlewares/permissions");
const timeZoneRouter = express_1.default.Router();
timeZoneRouter.get("/", timeZone_1.getAllTimeZones);
timeZoneRouter.get("/find/:id", timeZone_1.getTimeZone);
timeZoneRouter.get("/lobby/:lobby", timeZone_1.getTimeZonesByLobby);
timeZoneRouter.post("/", timeZone_1.createTimeZone);
timeZoneRouter.put("/:id", timeZone_1.updateTimeZone);
timeZoneRouter.delete("/:id", permissions_1.checkAdminPermission, timeZone_1.deleteTimeZone);
exports.default = timeZoneRouter;
