"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accessRule_1 = require("../controllers/accessRule");
const permissions_1 = require("../middlewares/permissions");
const accessRuleRouter = express_1.default.Router();
accessRuleRouter.get("/", accessRule_1.getAllAccessRules);
accessRuleRouter.get("/find/:id", accessRule_1.getAccessRule);
accessRuleRouter.get("/lobby/:lobby", accessRule_1.getAccessRulesByLobby);
accessRuleRouter.post("/", accessRule_1.createAccessRule);
accessRuleRouter.put("/:id", accessRule_1.updateAccessRule);
accessRuleRouter.delete("/:id", permissions_1.checkAdminPermission, accessRule_1.deleteAccessRule);
exports.default = accessRuleRouter;
