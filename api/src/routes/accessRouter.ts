import express from "express";
import {
  createAccess,
  getAllAccess,
  getAccess,
  updateAccess,
  deleteAccess
} from "../controllers/access";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRouter = express.Router();

accessRouter.get("/", getAllAccess);
accessRouter.get("/:id", getAccess);
accessRouter.post("/", createAccess);
accessRouter.put("/:id", updateAccess);
accessRouter.delete("/:id", checkAdminPermission, deleteAccess);

export default accessRouter;
