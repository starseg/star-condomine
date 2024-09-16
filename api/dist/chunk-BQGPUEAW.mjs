import {
  checkAdminPermission
} from "./chunk-JI5AOONO.mjs";
import {
  createOperator,
  deleteOperator,
  getAllOperators,
  getOperator,
  updateOperator
} from "./chunk-VRWGETS4.mjs";

// src/routes/operatorRouter.ts
import express from "express";
var operatorRouter = express.Router();
operatorRouter.use(checkAdminPermission);
operatorRouter.get("/", getAllOperators);
operatorRouter.get("/find/:id", getOperator);
operatorRouter.post("/", createOperator);
operatorRouter.put("/:id", updateOperator);
operatorRouter.delete("/:id", deleteOperator);
var operatorRouter_default = operatorRouter;

export {
  operatorRouter_default
};
