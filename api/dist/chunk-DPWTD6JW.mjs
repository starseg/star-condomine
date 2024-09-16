import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createTelephone,
  deletePhonesByMember,
  deleteTelephone,
  getAllTelephones,
  getTelephone,
  getTelephonesByMember
} from "./chunk-AOUVEGIY.mjs";

// src/routes/telephoneRouter.ts
import express from "express";
var telephoneRouter = express.Router();
telephoneRouter.get("/", getAllTelephones);
telephoneRouter.get("/find/:id", getTelephone);
telephoneRouter.get("/member/:id", getTelephonesByMember);
telephoneRouter.post("/", createTelephone);
telephoneRouter.delete("/id/:id", checkAdminPermission, deleteTelephone);
telephoneRouter.delete("/member/:id", deletePhonesByMember);
var telephoneRouter_default = telephoneRouter;

export {
  telephoneRouter_default
};
