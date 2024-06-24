import express from "express";
import {
  count,
  accessesByLobby,
  problemsByLobby,
  accessesByOperator,
  countAccessesPerHour,
} from "../controllers/generalData";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", count);
generalDataRouter.get("/accessesByLobby", accessesByLobby);
generalDataRouter.get("/problemsByLobby", problemsByLobby);
generalDataRouter.get("/accessesByOperator", accessesByOperator);
generalDataRouter.get("/countAccessesPerHour", countAccessesPerHour);

export default generalDataRouter;
