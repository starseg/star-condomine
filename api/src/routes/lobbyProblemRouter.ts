import express from "express";
import {
  createLobbyProblem,
  getAllLobbyProblems,
  getLobbyProblem,
  updateLobbyProblem,
  deleteLobbyProblem
} from "../controllers/lobbyProblem";
import { checkAdminPermission } from "../middlewares/permissions";

const lobbyProblemRouter = express.Router();

lobbyProblemRouter.get("/", getAllLobbyProblems);
lobbyProblemRouter.get("/:id", getLobbyProblem);
lobbyProblemRouter.post("/", createLobbyProblem);
lobbyProblemRouter.put("/:id", updateLobbyProblem);
lobbyProblemRouter.delete("/:id", checkAdminPermission, deleteLobbyProblem);

export default lobbyProblemRouter;
