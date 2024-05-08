import express from "express";
import {
  createTag,
  updateTag,
  getAllTags,
  getTag,
  deleteTag,
  getTagTypes,
  deleteTagsByMember,
  getTagsByMember,
} from "../controllers/tag";
import { checkAdminPermission } from "../middlewares/permissions";

const tagRouter = express.Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/find/:id", getTag);
tagRouter.get("/types", getTagTypes);
tagRouter.get("/member/:id", getTagsByMember);
tagRouter.post("/", createTag);
tagRouter.put("/:id", updateTag);
tagRouter.delete("/id/:id", checkAdminPermission, deleteTag);
tagRouter.delete("/member/:id", deleteTagsByMember);

export default tagRouter;
