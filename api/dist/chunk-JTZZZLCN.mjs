import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getGroup,
  getGroupsByLobby,
  updateGroup
} from "./chunk-YNESARUD.mjs";

// src/routes/groupRouter.ts
import express from "express";
var groupRouter = express.Router();
groupRouter.get("/", getAllGroups);
groupRouter.get("/find/:id", getGroup);
groupRouter.get("/lobby/:lobby", getGroupsByLobby);
groupRouter.post("/", createGroup);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", checkAdminPermission, deleteGroup);
var groupRouter_default = groupRouter;

export {
  groupRouter_default
};
