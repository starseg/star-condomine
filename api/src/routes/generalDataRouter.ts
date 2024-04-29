import express from "express";
import { count, accessesByLobby } from "../controllers/generalData";

const generalDataRouter = express.Router();

generalDataRouter.get("/count", count);
generalDataRouter.get("/accessesByLobby", accessesByLobby);

export default generalDataRouter;
