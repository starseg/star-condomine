import express from "express";
import {
  createMember,
  getAllMembers,
  getMember,
  updateMember,
  deleteMember
} from "../controllers/member";

const memberRouter = express.Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/:id", getMember);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", deleteMember);

export default memberRouter;
