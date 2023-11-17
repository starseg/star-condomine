import express from "express";
import {
  createTag,
  getAllTags,
  getTag,
  deleteTag
} from "../controllers/tag";
import { checkAdminPermission } from "../middlewares/permissions";

const tagRouter = express.Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/:id", getTag);
tagRouter.post("/", createTag);
tagRouter.delete("/:id", checkAdminPermission, deleteTag);

export default tagRouter;
