import express from "express";
import {
  createLobbyCalendar,
  getAllLobbyCalendars,
  getLobbyCalendar,
  updateLobbyCalendar,
  deleteLobbyCalendar,
  getCalendarByLobby,
} from "../controllers/lobbyCalendar";
import { checkAdminPermission } from "../middlewares/permissions";

const lobbyCalendarRouter = express.Router();

lobbyCalendarRouter.get("/", getAllLobbyCalendars);
lobbyCalendarRouter.get("/find/:id", getLobbyCalendar);
lobbyCalendarRouter.get("/lobby/:lobby", getCalendarByLobby);
lobbyCalendarRouter.post("/", createLobbyCalendar);
lobbyCalendarRouter.put("/:id", updateLobbyCalendar);
lobbyCalendarRouter.delete("/:id", checkAdminPermission, deleteLobbyCalendar);

export default lobbyCalendarRouter;
