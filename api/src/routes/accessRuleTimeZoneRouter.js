"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accessRuleTimeZone_1 = require("../controllers/accessRuleTimeZone");
const permissions_1 = require("../middlewares/permissions");
const accessRuleTimeZoneRouter = express_1.default.Router();
accessRuleTimeZoneRouter.get("/", accessRuleTimeZone_1.getAllAccessRuleTimeZones);
accessRuleTimeZoneRouter.get("/find/:id", accessRuleTimeZone_1.getAccessRuleTimeZone);
accessRuleTimeZoneRouter.get("/lobby/:lobby", accessRuleTimeZone_1.getAccessRuleTimeZonesByLobby);
accessRuleTimeZoneRouter.post("/", accessRuleTimeZone_1.createAccessRuleTimeZone);
accessRuleTimeZoneRouter.put("/:id", accessRuleTimeZone_1.updateAccessRuleTimeZone);
accessRuleTimeZoneRouter.delete("/:id", permissions_1.checkAdminPermission, accessRuleTimeZone_1.deleteAccessRuleTimeZone);
exports.default = accessRuleTimeZoneRouter;
