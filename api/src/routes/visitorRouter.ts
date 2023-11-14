import express from "express";
import {
  createVisitor,
  getAllVisitors,
  getVisitor,
  updateVisitor,
  deleteVisitor
} from "../controllers/visitor";

const visitorRouter = express.Router();

visitorRouter.get("/", getAllVisitors);
visitorRouter.get("/:id", getVisitor);
visitorRouter.post("/", createVisitor);
visitorRouter.put("/:id", updateVisitor);
visitorRouter.delete("/:id", deleteVisitor);

export default visitorRouter;
