import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createLobbyCalendar,
  deleteLobbyCalendar,
  getAllLobbyCalendars,
  getCalendarByLobby,
  getFilteredCalendar,
  getLobbyCalendar,
  getTodaysHoliday,
  updateLobbyCalendar
} from "./chunk-CJDDFBBM.mjs";

// src/routes/lobbyCalendarRouter.ts
import express from "express";
var lobbyCalendarRouter = express.Router();
lobbyCalendarRouter.get("/", getAllLobbyCalendars);
lobbyCalendarRouter.get("/find/:id", getLobbyCalendar);
lobbyCalendarRouter.get("/lobby/:lobby", getCalendarByLobby);
lobbyCalendarRouter.get("/today/:lobby", getTodaysHoliday);
lobbyCalendarRouter.get("/filtered/:lobby", getFilteredCalendar);
lobbyCalendarRouter.post("/", createLobbyCalendar);
lobbyCalendarRouter.put("/:id", updateLobbyCalendar);
lobbyCalendarRouter.delete("/:id", checkAdminPermission, deleteLobbyCalendar);
var lobbyCalendarRouter_default = lobbyCalendarRouter;

export {
  lobbyCalendarRouter_default
};
