"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const operator_1 = require("../controllers/operator");
const permissions_1 = require("../middlewares/permissions");
const operatorRouter = express_1.default.Router();
operatorRouter.use(permissions_1.checkAdminPermission);
operatorRouter.get("/", operator_1.getAllOperators);
operatorRouter.get("/find/:id", operator_1.getOperator);
operatorRouter.post("/", operator_1.createOperator);
operatorRouter.put("/:id", operator_1.updateOperator);
operatorRouter.delete("/:id", operator_1.deleteOperator);
exports.default = operatorRouter;
