import express from "express";
import {
  createTag,
  getAllTags,
  getTag,
  deleteTag,
  getTagTypes,
  deleteTagsByMember,
} from "../controllers/tag";
import { checkAdminPermission } from "../middlewares/permissions";

const tagRouter = express.Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/find/:id", getTag);
tagRouter.get("/types", getTagTypes);
tagRouter.post("/", createTag);
tagRouter.delete("/id/:id", checkAdminPermission, deleteTag);
tagRouter.delete("/member/:id", deleteTagsByMember);

export default tagRouter;
