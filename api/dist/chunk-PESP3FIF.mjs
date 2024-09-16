import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createMemberGroup,
  deleteMemberGroup,
  getAllMemberGroups,
  getMemberGroup,
  getMemberGroupsByLobby,
  updateMemberGroup
} from "./chunk-DEJJPRBX.mjs";

// src/routes/memberGroupRouter.ts
import express from "express";
var memberGroupRouter = express.Router();
memberGroupRouter.get("/", getAllMemberGroups);
memberGroupRouter.get("/find/:id", getMemberGroup);
memberGroupRouter.get("/lobby/:lobby", getMemberGroupsByLobby);
memberGroupRouter.post("/", createMemberGroup);
memberGroupRouter.put("/:id", updateMemberGroup);
memberGroupRouter.delete("/:id", checkAdminPermission, deleteMemberGroup);
var memberGroupRouter_default = memberGroupRouter;

export {
  memberGroupRouter_default
};
