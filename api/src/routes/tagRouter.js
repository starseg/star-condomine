"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tag_1 = require("../controllers/tag");
const permissions_1 = require("../middlewares/permissions");
const tagRouter = express_1.default.Router();
tagRouter.get("/", tag_1.getAllTags);
tagRouter.get("/find/:id", tag_1.getTag);
tagRouter.get("/types", tag_1.getTagTypes);
tagRouter.get("/member/:id", tag_1.getTagsByMember);
tagRouter.post("/", tag_1.createTag);
tagRouter.put("/:id", tag_1.updateTag);
tagRouter.delete("/id/:id", permissions_1.checkAdminPermission, tag_1.deleteTag);
tagRouter.delete("/member/:id", tag_1.deleteTagsByMember);
exports.default = tagRouter;
