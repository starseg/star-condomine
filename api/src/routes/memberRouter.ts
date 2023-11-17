import express from "express";
import {
  createMember,
  getAllMembers,
  getMember,
  updateMember,
  deleteMember
} from "../controllers/member";
import { checkAdminPermission } from "../middlewares/permissions";

const memberRouter = express.Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/:id", getMember);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", checkAdminPermission, deleteMember);

export default memberRouter;
