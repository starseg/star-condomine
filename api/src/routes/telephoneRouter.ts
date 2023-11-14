import express from "express";
import {
  createTelephone,
  getAllTelephones,
  getTelephone,
  deleteTelephone
} from "../controllers/telephone";

const telephoneRouter = express.Router();

telephoneRouter.get("/", getAllTelephones);
telephoneRouter.get("/:id", getTelephone);
telephoneRouter.post("/", createTelephone);
telephoneRouter.delete("/:id", deleteTelephone);

export default telephoneRouter;
