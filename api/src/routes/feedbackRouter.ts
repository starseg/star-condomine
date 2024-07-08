import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  countNewFeedbacks,
} from "../controllers/feedback";
import { checkAdminPermission } from "../middlewares/permissions";

const feedbackRouter = express.Router();

feedbackRouter.get("/", getAllFeedbacks);
feedbackRouter.get("/find/:id", getFeedback);
feedbackRouter.get("/new", countNewFeedbacks);
feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:id", updateFeedback);
feedbackRouter.delete("/:id", checkAdminPermission, deleteFeedback);

export default feedbackRouter;
