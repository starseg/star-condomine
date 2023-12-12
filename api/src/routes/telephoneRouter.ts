import express from "express";
import {
  createTelephone,
  getAllTelephones,
  getTelephone,
  deleteTelephone,
  getTelephonesByMember,
} from "../controllers/telephone";
import { checkAdminPermission } from "../middlewares/permissions";

const telephoneRouter = express.Router();

telephoneRouter.get("/", getAllTelephones);
telephoneRouter.get("/find/:id", getTelephone);
telephoneRouter.get("/member/:id", getTelephonesByMember);
telephoneRouter.post("/", createTelephone);
telephoneRouter.delete("/:id", checkAdminPermission, deleteTelephone);

export default telephoneRouter;
