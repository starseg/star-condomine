"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerBrand_1 = require("../controllers/controllerBrand");
const permissions_1 = require("../middlewares/permissions");
const brandRouter = express_1.default.Router();
brandRouter.get("/", controllerBrand_1.getAllBrands);
brandRouter.get("/find/:id", controllerBrand_1.getBrand);
brandRouter.post("/", controllerBrand_1.createBrand);
brandRouter.put("/:id", controllerBrand_1.updateBrand);
brandRouter.delete("/:id", permissions_1.checkAdminPermission, controllerBrand_1.deleteBrand);
exports.default = brandRouter;
