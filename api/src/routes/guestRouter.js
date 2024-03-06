"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guest_1 = require("../controllers/guest");
const guestRouter = express_1.default.Router();
guestRouter.post("/member", guest_1.createMember);
guestRouter.post("/telephone", guest_1.createTelephone);
guestRouter.get("/address", guest_1.getAddressTypes);
guestRouter.post("/visitor", guest_1.createVisitor);
guestRouter.get("/visitor/types", guest_1.getVisitorTypes);
exports.default = guestRouter;
