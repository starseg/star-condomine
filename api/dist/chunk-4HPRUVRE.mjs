import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createTag,
  deleteTag,
  deleteTagsByMember,
  getAllTags,
  getTag,
  getTagTypes,
  getTagsByLobby,
  getTagsByMember,
  updateTag
} from "./chunk-N5A7YI3H.mjs";

// src/routes/tagRouter.ts
import express from "express";
var tagRouter = express.Router();
tagRouter.get("/", getAllTags);
tagRouter.get("/find/:id", getTag);
tagRouter.get("/types", getTagTypes);
tagRouter.get("/member/:id", getTagsByMember);
tagRouter.get("/lobby/:id", getTagsByLobby);
tagRouter.post("/", createTag);
tagRouter.put("/:id", updateTag);
tagRouter.delete("/id/:id", checkAdminPermission, deleteTag);
tagRouter.delete("/member/:id", deleteTagsByMember);
var tagRouter_default = tagRouter;

export {
  tagRouter_default
};
