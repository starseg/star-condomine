"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_1 = require("../controllers/vehicle");
const permissions_1 = require("../middlewares/permissions");
const vehicleRouter = express_1.default.Router();
vehicleRouter.get("/", vehicle_1.getAllVehicles);
vehicleRouter.get("/find/:id", vehicle_1.getVehicle);
vehicleRouter.get("/member/:id", vehicle_1.getVehiclesByOwner);
vehicleRouter.get("/lobby/:lobby", vehicle_1.getVehiclesByLobby);
vehicleRouter.get("/types", vehicle_1.getVehicleTypes);
vehicleRouter.get("/filtered/:lobby", vehicle_1.getFilteredVehicles);
vehicleRouter.post("/", vehicle_1.createVehicle);
vehicleRouter.put("/:id", vehicle_1.updateVehicle);
vehicleRouter.delete("/:id", permissions_1.checkAdminPermission, vehicle_1.deleteVehicle);
exports.default = vehicleRouter;
