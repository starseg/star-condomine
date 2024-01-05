"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = require("../controllers/access");
const permissions_1 = require("../middlewares/permissions");
const accessRouter = express_1.default.Router();
accessRouter.get("/", access_1.getAllAccess);
accessRouter.get("/find/:id", access_1.getAccess);
accessRouter.get("/lobby/:lobby", access_1.getAccessByLobby);
accessRouter.get("/filtered/:lobby", access_1.getFilteredAccess);
accessRouter.get("/report/:lobby", access_1.generateReport);
accessRouter.post("/", access_1.createAccess);
accessRouter.put("/:id", access_1.updateAccess);
accessRouter.delete("/:id", permissions_1.checkAdminPermission, access_1.deleteAccess);
exports.default = accessRouter;
