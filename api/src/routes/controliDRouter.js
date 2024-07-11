"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controliD_1 = require("../controllers/controliD");
const controliDRouter = express_1.default.Router();
controliDRouter.get("/push", controliD_1.push);
controliDRouter.post("/result", controliD_1.result);
exports.default = controliDRouter;
