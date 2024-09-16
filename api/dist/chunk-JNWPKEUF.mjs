import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createLobbyProblem,
  deleteLobbyProblem,
  getAllLobbyProblems,
  getFilteredLobbyProblem,
  getLobbyProblem,
  getProblemsByLobby,
  updateLobbyProblem
} from "./chunk-RAU2RGZA.mjs";

// src/routes/lobbyProblemRouter.ts
import express from "express";
var lobbyProblemRouter = express.Router();
lobbyProblemRouter.get("/", getAllLobbyProblems);
lobbyProblemRouter.get("/find/:id", getLobbyProblem);
lobbyProblemRouter.get("/lobby/:lobby", getProblemsByLobby);
lobbyProblemRouter.get("/filtered/:lobby", getFilteredLobbyProblem);
lobbyProblemRouter.post("/", createLobbyProblem);
lobbyProblemRouter.put("/:id", updateLobbyProblem);
lobbyProblemRouter.delete("/:id", checkAdminPermission, deleteLobbyProblem);
var lobbyProblemRouter_default = lobbyProblemRouter;

export {
  lobbyProblemRouter_default
};
