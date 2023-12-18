import express from "express";
import {
  createLogging,
  getAllLoggings,
  getLogging,
  deleteLogging,
} from "../controllers/logging";
import { checkAdminPermission } from "../middlewares/permissions";

const loggingRouter = express.Router();

loggingRouter.get("/", getAllLoggings);
// loggingRouter.get("/:id", getLogging);
// // loggingRouter.post("/", createLogging);
// loggingRouter.delete("/:id", checkAdminPermission, deleteLogging);

export default loggingRouter;
