"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const areaAccessRule_1 = require("../controllers/areaAccessRule");
const permissions_1 = require("../middlewares/permissions");
const areaAccessRuleRouter = express_1.default.Router();
areaAccessRuleRouter.get("/", areaAccessRule_1.getAllAreaAccessRules);
areaAccessRuleRouter.get("/find/:id", areaAccessRule_1.getAreaAccessRule);
areaAccessRuleRouter.post("/", areaAccessRule_1.createAreaAccessRule);
areaAccessRuleRouter.put("/:id", areaAccessRule_1.updateAreaAccessRule);
areaAccessRuleRouter.delete("/:id", permissions_1.checkAdminPermission, areaAccessRule_1.deleteAreaAccessRule);
exports.default = areaAccessRuleRouter;
