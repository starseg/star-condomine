import express from "express";
import {
  createLobbyCalendar,
  getAllLobbyCalendars,
  getLobbyCalendar,
  updateLobbyCalendar,
  deleteLobbyCalendar
} from "../controllers/lobbyCalendar";

const lobbyCalendarRouter = express.Router();

lobbyCalendarRouter.get("/", getAllLobbyCalendars);
lobbyCalendarRouter.get("/:id", getLobbyCalendar);
lobbyCalendarRouter.post("/", createLobbyCalendar);
lobbyCalendarRouter.put("/:id", updateLobbyCalendar);
lobbyCalendarRouter.delete("/:id", deleteLobbyCalendar);

export default lobbyCalendarRouter;
