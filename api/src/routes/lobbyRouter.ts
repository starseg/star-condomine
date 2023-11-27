import express from "express";
import {
  createLobby,
  getAllLobbies,
  getLobby,
  updateLobby,
  deleteLobby,
  getFilteredLobbies
} from "../controllers/lobby";
import { checkAdminPermission } from "../middlewares/permissions";

const lobbyRouter = express.Router();

lobbyRouter.get("/", getAllLobbies);
lobbyRouter.get("/find/:id", getLobby);
lobbyRouter.get("/filtered", getFilteredLobbies);
lobbyRouter.post("/", checkAdminPermission, createLobby);
lobbyRouter.put("/:id", checkAdminPermission, updateLobby);
lobbyRouter.delete("/:id", checkAdminPermission, deleteLobby);

export default lobbyRouter;
