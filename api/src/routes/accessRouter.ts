import express from "express";
import {
  createAccess,
  getAllAccess,
  getAccess,
  updateAccess,
  deleteAccess,
  getAccessByLobby,
} from "../controllers/access";
import { checkAdminPermission } from "../middlewares/permissions";

const accessRouter = express.Router();

accessRouter.get("/", getAllAccess);
accessRouter.get("/find/:id", getAccess);
accessRouter.get("/lobby/:lobby", getAccessByLobby);
accessRouter.post("/", createAccess);
accessRouter.put("/:id", updateAccess);
accessRouter.delete("/:id", checkAdminPermission, deleteAccess);

export default accessRouter;
