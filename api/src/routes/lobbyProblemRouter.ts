import express from "express";
import {
  createLobbyProblem,
  getAllLobbyProblems,
  getLobbyProblem,
  updateLobbyProblem,
  deleteLobbyProblem
} from "../controllers/lobbyProblem";

const lobbyProblemRouter = express.Router();

lobbyProblemRouter.get("/", getAllLobbyProblems);
lobbyProblemRouter.get("/:id", getLobbyProblem);
lobbyProblemRouter.post("/", createLobbyProblem);
lobbyProblemRouter.put("/:id", updateLobbyProblem);
lobbyProblemRouter.delete("/:id", deleteLobbyProblem);

export default lobbyProblemRouter;
