import express from "express";
import {
  createLobby,
  getAllLobbies,
  getLobby,
  updateLobby,
  deleteLobby
} from "../controllers/lobby";

const lobbyRouter = express.Router();

lobbyRouter.get("/", getAllLobbies);
lobbyRouter.get("/:id", getLobby);
lobbyRouter.post("/", createLobby);
lobbyRouter.put("/:id", updateLobby);
lobbyRouter.delete("/:id", deleteLobby);

export default lobbyRouter;
