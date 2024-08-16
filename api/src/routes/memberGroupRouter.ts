import express from "express";
import {
  createMemberGroup,
  deleteMemberGroup,
  getAllMemberGroups,
  getMemberGroup,
  updateMemberGroup,
  getMemberGroupsByLobby,
} from "../controllers/memberGroup";
import { checkAdminPermission } from "../middlewares/permissions";

const memberGroupRouter = express.Router();

memberGroupRouter.get("/", getAllMemberGroups);
memberGroupRouter.get("/find/:id", getMemberGroup);
memberGroupRouter.get("/lobby/:lobby", getMemberGroupsByLobby);
memberGroupRouter.post("/", createMemberGroup);
memberGroupRouter.put("/:id", updateMemberGroup);
memberGroupRouter.delete("/:id", checkAdminPermission, deleteMemberGroup);

export default memberGroupRouter;
