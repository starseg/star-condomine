"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deviceModel_1 = require("../controllers/deviceModel");
const permissions_1 = require("../middlewares/permissions");
const deviceModelRouter = express_1.default.Router();
deviceModelRouter.get("/", deviceModel_1.getDeviceModels);
deviceModelRouter.get("/find/:id", deviceModel_1.getDeviceModel);
deviceModelRouter.post("/", deviceModel_1.createDeviceModel);
deviceModelRouter.put("/:id", deviceModel_1.updateDeviceModel);
deviceModelRouter.delete("/:id", permissions_1.checkAdminPermission, deviceModel_1.deleteDeviceModel);
exports.default = deviceModelRouter;
