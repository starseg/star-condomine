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
  getTagsByMember,
  getMemberPhoto,
} from "../controllers/member";
import { checkAdminPermission } from "../middlewares/permissions";

const memberRouter = express.Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/find/:id", getMember);
memberRouter.get("/filtered/:lobby", getFilteredMembers);
memberRouter.get("/count/:lobby", countMembers);
memberRouter.get("/lobby/:lobby", getMembersByLobby);
memberRouter.get("/tags/:id", getTagsByMember);
memberRouter.get("/address", getAddressTypes);
memberRouter.get("/find/:id/base64photo", getMemberPhoto);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", checkAdminPermission, deleteMember);

export default memberRouter;
