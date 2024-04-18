"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const device_1 = require("../controllers/device");
const permissions_1 = require("../middlewares/permissions");
const deviceRouter = express_1.default.Router();
deviceRouter.get("/", device_1.getAllDevices);
deviceRouter.get("/find/:id", device_1.getDevice);
deviceRouter.get("/lobby/:lobby", device_1.getDeviceByLobby);
deviceRouter.get("/filtered/:lobby", device_1.getFilteredDevices);
deviceRouter.get("/models", device_1.getDeviceModels);
deviceRouter.post("/", device_1.createDevice);
deviceRouter.put("/:id", device_1.updateDevice);
deviceRouter.delete("/:id", permissions_1.checkAdminPermission, device_1.deleteDevice);
exports.default = deviceRouter;
