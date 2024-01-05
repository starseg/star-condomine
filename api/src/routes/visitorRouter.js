"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const visitor_1 = require("../controllers/visitor");
const permissions_1 = require("../middlewares/permissions");
const visitorRouter = express_1.default.Router();
visitorRouter.get("/", visitor_1.getAllVisitors);
visitorRouter.get("/find/:id", visitor_1.getVisitor);
visitorRouter.get("/types", visitor_1.getVisitorTypes);
visitorRouter.get("/lobby/:lobby", visitor_1.getVisitorsByLobby);
visitorRouter.get("/filtered/:lobby", visitor_1.getFilteredVisitors);
visitorRouter.post("/", visitor_1.createVisitor);
visitorRouter.put("/:id", visitor_1.updateVisitor);
visitorRouter.delete("/:id", permissions_1.checkAdminPermission, visitor_1.deleteVisitor);
exports.default = visitorRouter;
