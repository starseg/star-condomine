import express from "express";
import {
  addCommand,
  clearResults,
  push,
  result,
} from "../controllers/controliD-controller";

const controliDRouter = express.Router();

controliDRouter.get("/push", push);
controliDRouter.post("/result", result);

controliDRouter.post("/add-command", addCommand);
controliDRouter.get("/clearResults", clearResults);

export default controliDRouter;
