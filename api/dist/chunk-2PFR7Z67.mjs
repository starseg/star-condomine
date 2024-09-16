import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createLobby,
  deleteLobby,
  getAllLobbies,
  getFilteredLobbies,
  getLobby,
  updateLobby
} from "./chunk-YXAZVKDX.mjs";

// src/routes/lobbyRouter.ts
import express from "express";
var lobbyRouter = express.Router();
lobbyRouter.get("/", getAllLobbies);
lobbyRouter.get("/find/:id", getLobby);
lobbyRouter.get("/filtered", getFilteredLobbies);
lobbyRouter.post("/", checkAdminPermission, createLobby);
lobbyRouter.put("/:id", checkAdminPermission, updateLobby);
lobbyRouter.delete("/:id", checkAdminPermission, deleteLobby);
var lobbyRouter_default = lobbyRouter;

export {
  lobbyRouter_default
};
