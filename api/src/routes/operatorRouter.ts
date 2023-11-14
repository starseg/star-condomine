import express from "express";
import {
  createOperator,
  getAllOperators,
  getOperator,
  updateOperator,
  deleteOperator
} from "../controllers/operator";

const operatorRouter = express.Router();

operatorRouter.get("/", getAllOperators);
operatorRouter.get("/:id", getOperator);
operatorRouter.post("/", createOperator);
operatorRouter.put("/:id", updateOperator);
operatorRouter.delete("/:id", deleteOperator);

export default operatorRouter;