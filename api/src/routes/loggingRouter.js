"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = require("../controllers/logging");
const permissions_1 = require("../middlewares/permissions");
const loggingRouter = express_1.default.Router();
loggingRouter.get("/", logging_1.getAllLoggings);
// loggingRouter.get("/:id", getLogging);
// loggingRouter.post("/", createLogging);
loggingRouter.delete("/:id", permissions_1.checkAdminPermission, logging_1.deleteLogging);
exports.default = loggingRouter;
