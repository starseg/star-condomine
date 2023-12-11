import express from "express";
import {
  createMember,
  getAllMembers,
  getMembersByLobby,
  getMember,
  updateMember,
  deleteMember,
  getAddressTypes,
  getFilteredMembers,
  countMembers,
} from "../controllers/member";
import { checkAdminPermission } from "../middlewares/permissions";

const memberRouter = express.Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/find/:id", getMember);
memberRouter.get("/filtered/:lobby", getFilteredMembers);
memberRouter.get("/count/:lobby", countMembers);
memberRouter.get("/lobby/:lobby", getMembersByLobby);
memberRouter.get("/address", getAddressTypes);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", checkAdminPermission, deleteMember);

export default memberRouter;
