import express from "express";
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getGroup,
  updateGroup,
} from "../controllers/group";
import { checkAdminPermission } from "../middlewares/permissions";

const groupRouter = express.Router();

groupRouter.get("/", getAllGroups);
groupRouter.get("/find/:id", getGroup);
groupRouter.post("/", createGroup);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", checkAdminPermission, deleteGroup);

export default groupRouter;
