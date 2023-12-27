import express from "express";
import {
  createAccess,
  getAllAccess,
  getAccess,
  updateAccess,
  deleteAccess,
  getAccessByLobby,
  getFilteredAccess,
  generateReport,
} from "../controllers/access";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRouter = express.Router();

accessRouter.get("/", getAllAccess);
accessRouter.get("/find/:id", getAccess);
accessRouter.get("/lobby/:lobby", getAccessByLobby);
accessRouter.get("/filtered/:lobby", getFilteredAccess);
accessRouter.get("/report/:lobby", generateReport);
accessRouter.post("/", createAccess);
accessRouter.put("/:id", updateAccess);
accessRouter.delete("/:id", checkAdminPermission, deleteAccess);

export default accessRouter;
