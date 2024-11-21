import express from "express";
import {
  getCardsCountData,
  getAccessesByLobby,
  getProblemsByLobby,
  getAccessesByOperator,
  getCountAccessesPerHour,
  getCountExitsPerHour,
  getSchedulingByLobby,
  getAccessesByVisitorType,
  getLogsByOperator,
} from "../controllers/general-data-controller";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", getCardsCountData);
generalDataRouter.get("/accessesByLobby", getAccessesByLobby);
generalDataRouter.get("/problemsByLobby", getProblemsByLobby);
generalDataRouter.get("/accessesByOperator", getAccessesByOperator);
generalDataRouter.get("/countAccessesPerHour", getCountAccessesPerHour);
generalDataRouter.get("/countExitsPerHour", getCountExitsPerHour);
generalDataRouter.get("/schedulingsByLobby", getSchedulingByLobby);
generalDataRouter.get("/accessesByVisitorType", getAccessesByVisitorType);
generalDataRouter.get("/logsByOperator", getLogsByOperator);

export default generalDataRouter;
