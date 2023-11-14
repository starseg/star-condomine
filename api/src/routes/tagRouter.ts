import express from "express";
import {
  createTag,
  getAllTags,
  getTag,
  deleteTag
} from "../controllers/tag";

const tagRouter = express.Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/:id", getTag);
tagRouter.post("/", createTag);
tagRouter.delete("/:id", deleteTag);

export default tagRouter;
