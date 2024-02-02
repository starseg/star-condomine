"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lobbyCalendar_1 = require("../controllers/lobbyCalendar");
const permissions_1 = require("../middlewares/permissions");
const lobbyCalendarRouter = express_1.default.Router();
lobbyCalendarRouter.get("/", lobbyCalendar_1.getAllLobbyCalendars);
lobbyCalendarRouter.get("/find/:id", lobbyCalendar_1.getLobbyCalendar);
lobbyCalendarRouter.get("/lobby/:lobby", lobbyCalendar_1.getCalendarByLobby);
lobbyCalendarRouter.get("/today/:lobby", lobbyCalendar_1.getTodaysHoliday);
lobbyCalendarRouter.post("/", lobbyCalendar_1.createLobbyCalendar);
lobbyCalendarRouter.put("/:id", lobbyCalendar_1.updateLobbyCalendar);
lobbyCalendarRouter.delete("/:id", permissions_1.checkAdminPermission, lobbyCalendar_1.deleteLobbyCalendar);
exports.default = lobbyCalendarRouter;
