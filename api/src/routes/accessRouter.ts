import express from "express";
import {
  createAccess,
  getAccesses,
  getAccess,
  updateAccess,
  deleteAccess,
  getAccessByLobby,
  getFilteredAccesses,
  generateReport,
} from "../controllers/access-controller";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRouter = express.Router();

accessRouter.get("/", getAccesses);
accessRouter.get("/find/:id", getAccess);
accessRouter.get("/lobby/:lobby", getAccessByLobby);
accessRouter.get("/filtered/:lobby", getFilteredAccesses);
accessRouter.get("/report/:lobby", generateReport);
accessRouter.post("/", createAccess);
accessRouter.put("/:id", updateAccess);
accessRouter.delete("/:id", checkAdminPermission, deleteAccess);

export default accessRouter;
