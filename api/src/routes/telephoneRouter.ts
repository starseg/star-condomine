import express from "express";
import {
  createTelephone,
  getAllTelephones,
  getTelephone,
  deleteTelephone,
  getTelephonesByMember,
  deletePhonesByMember,
} from "../controllers/telephone";
import { checkAdminPermission } from "../middlewares/permissions";

const telephoneRouter = express.Router();

telephoneRouter.get("/", getAllTelephones);
telephoneRouter.get("/find/:id", getTelephone);
telephoneRouter.get("/member/:id", getTelephonesByMember);
telephoneRouter.post("/", createTelephone);
telephoneRouter.delete("/id/:id", checkAdminPermission, deleteTelephone);
telephoneRouter.delete("/member/:id", deletePhonesByMember);

export default telephoneRouter;
