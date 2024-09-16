import {
  createMember,
  createTelephone,
  createVisitor,
  getAddressTypes,
  getLobby,
  getVisitorTypes
} from "./chunk-62OVZDAY.mjs";

// src/routes/guestRouter.ts
import express from "express";
var guestRouter = express.Router();
guestRouter.post("/member", createMember);
guestRouter.post("/telephone", createTelephone);
guestRouter.get("/address", getAddressTypes);
guestRouter.post("/visitor", createVisitor);
guestRouter.get("/visitor/types", getVisitorTypes);
guestRouter.get("/lobby/:id", getLobby);
var guestRouter_default = guestRouter;

export {
  guestRouter_default
};
