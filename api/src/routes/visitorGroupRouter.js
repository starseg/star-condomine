"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const visitorGroup_1 = require("../controllers/visitorGroup");
const permissions_1 = require("../middlewares/permissions");
const visitorGroupRouter = express_1.default.Router();
visitorGroupRouter.get("/", visitorGroup_1.getAllVisitorGroups);
visitorGroupRouter.get("/find/:id", visitorGroup_1.getVisitorGroup);
visitorGroupRouter.get("/lobby/:lobby", visitorGroup_1.getVisitorGroupsByLobby);
visitorGroupRouter.post("/", visitorGroup_1.createVisitorGroup);
visitorGroupRouter.put("/:id", visitorGroup_1.updateVisitorGroup);
visitorGroupRouter.delete("/:id", permissions_1.checkAdminPermission, visitorGroup_1.deleteVisitorGroup);
exports.default = visitorGroupRouter;
