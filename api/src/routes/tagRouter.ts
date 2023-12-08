import express from "express";
import {
  createTag,
  getAllTags,
  getTag,
  deleteTag,
  getTagTypes
} from "../controllers/tag";
import { checkAdminPermission } from "../middlewares/permissions";

const tagRouter = express.Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/find/:id", getTag);
tagRouter.get("/types", getTagTypes);
tagRouter.post("/", createTag);
tagRouter.delete("/:id", checkAdminPermission, deleteTag);

export default tagRouter;
