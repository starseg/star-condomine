import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  deleteLogging,
  getAllLoggings
} from "./chunk-75DSBTFO.mjs";

// src/routes/loggingRouter.ts
import express from "express";
var loggingRouter = express.Router();
loggingRouter.get("/", getAllLoggings);
loggingRouter.delete("/:id", checkAdminPermission, deleteLogging);
var loggingRouter_default = loggingRouter;

export {
  loggingRouter_default
};
