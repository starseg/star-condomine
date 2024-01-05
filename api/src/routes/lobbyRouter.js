"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lobby_1 = require("../controllers/lobby");
const permissions_1 = require("../middlewares/permissions");
const lobbyRouter = express_1.default.Router();
lobbyRouter.get("/", lobby_1.getAllLobbies);
lobbyRouter.get("/find/:id", lobby_1.getLobby);
lobbyRouter.get("/filtered", lobby_1.getFilteredLobbies);
lobbyRouter.post("/", permissions_1.checkAdminPermission, lobby_1.createLobby);
lobbyRouter.put("/:id", permissions_1.checkAdminPermission, lobby_1.updateLobby);
lobbyRouter.delete("/:id", permissions_1.checkAdminPermission, lobby_1.deleteLobby);
exports.default = lobbyRouter;
