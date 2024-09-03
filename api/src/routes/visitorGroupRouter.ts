import express from "express";
import {
  createVisitorGroup,
  deleteVisitorGroup,
  getAllVisitorGroups,
  getVisitorGroup,
  updateVisitorGroup,
  getVisitorGroupsByLobby,
} from "../controllers/visitorGroup";
import { checkAdminPermission } from "../middlewares/permissions";

const visitorGroupRouter = express.Router();

visitorGroupRouter.get("/", getAllVisitorGroups);
visitorGroupRouter.get("/find/:id", getVisitorGroup);
visitorGroupRouter.get("/lobby/:lobby", getVisitorGroupsByLobby);
visitorGroupRouter.post("/", createVisitorGroup);
visitorGroupRouter.put("/:id", updateVisitorGroup);
visitorGroupRouter.delete("/:id", checkAdminPermission, deleteVisitorGroup);

export default visitorGroupRouter;
