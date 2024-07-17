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
controliDRouter.post("/add-command", controliD_1.addCommand);
controliDRouter.get("/results", controliD_1.results);
controliDRouter.get("/clearResults", controliD_1.clearResults);
exports.default = controliDRouter;
