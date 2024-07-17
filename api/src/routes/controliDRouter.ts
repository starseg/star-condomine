import express from "express";
import {
  addCommand,
  clearResults,
  push,
  result,
  results,
} from "../controllers/controliD";

const controliDRouter = express.Router();

controliDRouter.get("/push", push);
controliDRouter.post("/result", result);

controliDRouter.post("/add-command", addCommand);
controliDRouter.get("/results", results);
controliDRouter.get("/clearResults", clearResults);

export default controliDRouter;
