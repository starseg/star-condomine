"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lobbyProblem_1 = require("../controllers/lobbyProblem");
const permissions_1 = require("../middlewares/permissions");
const lobbyProblemRouter = express_1.default.Router();
lobbyProblemRouter.get("/", lobbyProblem_1.getAllLobbyProblems);
lobbyProblemRouter.get("/find/:id", lobbyProblem_1.getLobbyProblem);
lobbyProblemRouter.get("/lobby/:lobby", lobbyProblem_1.getProblemsByLobby);
lobbyProblemRouter.get("/filtered/:lobby", lobbyProblem_1.getFilteredLobbyProblem);
lobbyProblemRouter.post("/", lobbyProblem_1.createLobbyProblem);
lobbyProblemRouter.put("/:id", lobbyProblem_1.updateLobbyProblem);
lobbyProblemRouter.delete("/:id", permissions_1.checkAdminPermission, lobbyProblem_1.deleteLobbyProblem);
exports.default = lobbyProblemRouter;
