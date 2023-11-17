import express from "express";
import {
  createTelephone,
  getAllTelephones,
  getTelephone,
  deleteTelephone
} from "../controllers/telephone";
import { checkAdminPermission } from "../middlewares/permissions";

const telephoneRouter = express.Router();

telephoneRouter.get("/", getAllTelephones);
telephoneRouter.get("/:id", getTelephone);
telephoneRouter.post("/", createTelephone);
telephoneRouter.delete("/:id", checkAdminPermission, deleteTelephone);

export default telephoneRouter;
