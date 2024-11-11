import express from "express";
import {
  count,
  accessesByLobby,
  problemsByLobby,
  accessesByOperator,
  countAccessesPerHour,
  countExitsPerHour,
  schedulingsByLobby,
  accessesByVisitorType,
  logsByOperator,
} from "../controllers/generalData";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", count);
generalDataRouter.get("/accessesByLobby", accessesByLobby);
generalDataRouter.get("/problemsByLobby", problemsByLobby);
generalDataRouter.get("/accessesByOperator", accessesByOperator);
generalDataRouter.get("/countAccessesPerHour", countAccessesPerHour);
generalDataRouter.get("/countExitsPerHour", countExitsPerHour);
generalDataRouter.get("/schedulingsByLobby", schedulingsByLobby);
generalDataRouter.get("/accessesByVisitorType", accessesByVisitorType);
generalDataRouter.get("/logsByOperator", logsByOperator);

export default generalDataRouter;
