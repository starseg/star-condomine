import express from "express";
import {
  createMember,
  createTelephone,
  getAddressTypes,
  createVisitor,
  getVisitorTypes,
  getLobby,
} from "../controllers/guest";

const guestRouter = express.Router();

guestRouter.post("/member", createMember);
guestRouter.post("/telephone", createTelephone);
guestRouter.get("/address", getAddressTypes);

guestRouter.post("/visitor", createVisitor);
guestRouter.get("/visitor/types", getVisitorTypes);

guestRouter.get("/lobby/:id", getLobby);

export default guestRouter;
