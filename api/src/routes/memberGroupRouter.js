"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memberGroup_1 = require("../controllers/memberGroup");
const permissions_1 = require("../middlewares/permissions");
const memberGroupRouter = express_1.default.Router();
memberGroupRouter.get("/", memberGroup_1.getAllMemberGroups);
memberGroupRouter.get("/find/:id", memberGroup_1.getMemberGroup);
memberGroupRouter.get("/lobby/:lobby", memberGroup_1.getMemberGroupsByLobby);
memberGroupRouter.post("/", memberGroup_1.createMemberGroup);
memberGroupRouter.put("/:id", memberGroup_1.updateMemberGroup);
memberGroupRouter.delete("/:id", permissions_1.checkAdminPermission, memberGroup_1.deleteMemberGroup);
exports.default = memberGroupRouter;
