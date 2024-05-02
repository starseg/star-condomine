import express from "express";
import {
  count,
  accessesByLobby,
  problemsByLobby,
} from "../controllers/generalData";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", count);
generalDataRouter.get("/accessesByLobby", accessesByLobby);
generalDataRouter.get("/problemsByLobby", problemsByLobby);

export default generalDataRouter;
