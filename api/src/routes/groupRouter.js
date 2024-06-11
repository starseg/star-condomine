"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = require("../controllers/group");
const permissions_1 = require("../middlewares/permissions");
const groupRouter = express_1.default.Router();
groupRouter.get("/", group_1.getAllGroups);
groupRouter.get("/find/:id", group_1.getGroup);
groupRouter.post("/", group_1.createGroup);
groupRouter.put("/:id", group_1.updateGroup);
groupRouter.delete("/:id", permissions_1.checkAdminPermission, group_1.deleteGroup);
exports.default = groupRouter;
