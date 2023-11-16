import express from "express";
import { authenticateOperator } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/", authenticateOperator);

export default authRouter;
