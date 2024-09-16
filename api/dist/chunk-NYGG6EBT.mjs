import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  countMembers,
  createMember,
  deleteMember,
  getAddressTypes,
  getAllMembers,
  getFilteredMembers,
  getMember,
  getMemberPhoto,
  getMembersByLobby,
  getTagsByMember,
  updateMember
} from "./chunk-KKNRLSHO.mjs";

// src/routes/memberRouter.ts
import express from "express";
var memberRouter = express.Router();
memberRouter.get("/", getAllMembers);
memberRouter.get("/find/:id", getMember);
memberRouter.get("/filtered/:lobby", getFilteredMembers);
memberRouter.get("/count/:lobby", countMembers);
memberRouter.get("/lobby/:lobby", getMembersByLobby);
memberRouter.get("/tags/:id", getTagsByMember);
memberRouter.get("/address", getAddressTypes);
memberRouter.get("/find/:id/base64photo", getMemberPhoto);
memberRouter.post("/", createMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", checkAdminPermission, deleteMember);
var memberRouter_default = memberRouter;

export {
  memberRouter_default
};
