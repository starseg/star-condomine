"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_1 = require("../controllers/feedback");
const permissions_1 = require("../middlewares/permissions");
const feedbackRouter = express_1.default.Router();
feedbackRouter.get("/", feedback_1.getAllFeedbacks);
feedbackRouter.get("/find/:id", feedback_1.getFeedback);
feedbackRouter.post("/", feedback_1.createFeedback);
feedbackRouter.put("/:id", feedback_1.updateFeedback);
feedbackRouter.delete("/:id", permissions_1.checkAdminPermission, feedback_1.deleteFeedback);
exports.default = feedbackRouter;
