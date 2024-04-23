"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generalData_1 = require("../controllers/generalData");
const generalDataRouter = express_1.default.Router();
generalDataRouter.get("/count", generalData_1.count);
exports.default = generalDataRouter;
