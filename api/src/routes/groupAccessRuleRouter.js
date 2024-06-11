"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupAccessRule_1 = require("../controllers/groupAccessRule");
const permissions_1 = require("../middlewares/permissions");
const groupAccessRuleRouter = express_1.default.Router();
groupAccessRuleRouter.get("/", groupAccessRule_1.getAllGroupAccessRules);
groupAccessRuleRouter.get("/find/:id", groupAccessRule_1.getGroupAccessRule);
groupAccessRuleRouter.post("/", groupAccessRule_1.createGroupAccessRule);
groupAccessRuleRouter.put("/:id", groupAccessRule_1.updateGroupAccessRule);
groupAccessRuleRouter.delete("/:id", permissions_1.checkAdminPermission, groupAccessRule_1.deleteGroupAccessRule);
exports.default = groupAccessRuleRouter;
