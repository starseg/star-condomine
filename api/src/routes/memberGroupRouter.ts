import express from "express";
import {
  createMemberGroup,
  deleteMemberGroup,
  getAllMemberGroups,
  getMemberGroup,
  updateMemberGroup,
} from "../controllers/memberGroup";
import { checkAdminPermission } from "../middlewares/permissions";

const memberGroupRouter = express.Router();

memberGroupRouter.get("/", getAllMemberGroups);
memberGroupRouter.get("/find/:id", getMemberGroup);
memberGroupRouter.post("/", createMemberGroup);
memberGroupRouter.put("/:id", updateMemberGroup);
memberGroupRouter.delete("/:id", checkAdminPermission, deleteMemberGroup);

export default memberGroupRouter;
