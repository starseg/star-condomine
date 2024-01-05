"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const telephone_1 = require("../controllers/telephone");
const permissions_1 = require("../middlewares/permissions");
const telephoneRouter = express_1.default.Router();
telephoneRouter.get("/", telephone_1.getAllTelephones);
telephoneRouter.get("/find/:id", telephone_1.getTelephone);
telephoneRouter.get("/member/:id", telephone_1.getTelephonesByMember);
telephoneRouter.post("/", telephone_1.createTelephone);
telephoneRouter.delete("/:id", permissions_1.checkAdminPermission, telephone_1.deleteTelephone);
exports.default = telephoneRouter;
