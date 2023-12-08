import express from "express";
import {
  createMember,
  getAllMembers,
  getMember,
  updateMember,
  deleteMember,
  getAddressTypes
} from "../controllers/member";
import { checkAdminPermission } from "../middlewares/permissions";

const memberRouter = express.Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/find/:id", getMember);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", checkAdminPermission, deleteMember);
memberRouter.get("/address", getAddressTypes);

export default memberRouter;
