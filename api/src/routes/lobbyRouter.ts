import express from "express";
import {
  createLobby,
  getAllLobbies,
  getLobby,
  updateLobby,
  deleteLobby
} from "../controllers/lobby";
import { checkAdminPermission } from "../middlewares/permissions";

const lobbyRouter = express.Router();

lobbyRouter.get("/", getAllLobbies);
lobbyRouter.get("/:id", getLobby);
lobbyRouter.post("/", checkAdminPermission, createLobby);
lobbyRouter.put("/:id", checkAdminPermission, updateLobby);
lobbyRouter.delete("/:id", checkAdminPermission, deleteLobby);

export default lobbyRouter;
