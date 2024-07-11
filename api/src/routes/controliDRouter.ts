import express from "express";
import { push, result } from "../controllers/controliD";

const controliDRouter = express.Router();

controliDRouter.get("/push", push);
controliDRouter.post("/result", result);

export default controliDRouter;
