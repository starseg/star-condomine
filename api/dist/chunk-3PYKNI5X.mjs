import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  countNewFeedbacks,
  createFeedback,
  deleteFeedback,
  getAllFeedbacks,
  getFeedback,
  updateFeedback
} from "./chunk-2PSRWG6C.mjs";

// src/routes/feedbackRouter.ts
import express from "express";
var feedbackRouter = express.Router();
feedbackRouter.get("/", getAllFeedbacks);
feedbackRouter.get("/find/:id", getFeedback);
feedbackRouter.get("/new", countNewFeedbacks);
feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:id", updateFeedback);
feedbackRouter.delete("/:id", checkAdminPermission, deleteFeedback);
var feedbackRouter_default = feedbackRouter;

export {
  feedbackRouter_default
};
