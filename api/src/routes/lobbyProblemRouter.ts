import express from "express";
import {
  createLobbyProblem,
  getAllLobbyProblems,
  getLobbyProblem,
  updateLobbyProblem,
  deleteLobbyProblem,
  getProblemsByLobby,
  getFilteredLobbyProblem,
} from "../controllers/lobbyProblem";
import { checkAdminPermission } from "../middlewares/permissions";

const lobbyProblemRouter = express.Router();

lobbyProblemRouter.get("/", getAllLobbyProblems);
lobbyProblemRouter.get("/find/:id", getLobbyProblem);
lobbyProblemRouter.get("/lobby/:lobby", getProblemsByLobby);
lobbyProblemRouter.get("/filtered/:lobby", getFilteredLobbyProblem);
lobbyProblemRouter.post("/", createLobbyProblem);
lobbyProblemRouter.put("/:id", updateLobbyProblem);
lobbyProblemRouter.delete("/:id", checkAdminPermission, deleteLobbyProblem);

export default lobbyProblemRouter;
