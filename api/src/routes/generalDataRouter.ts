import express from "express";
import { count } from "../controllers/generalData";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", count);

export default generalDataRouter;
