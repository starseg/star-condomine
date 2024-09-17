import {
  visitorGroupRouter_default
} from "./chunk-CA64PUMW.mjs";
import {
  visitorRouter_default
} from "./chunk-DGVLP3FS.mjs";
import {
  operatorRouter_default
} from "./chunk-BQGPUEAW.mjs";
import {
  schedulingListRouter_default
} from "./chunk-3D2ARJCG.mjs";
import {
  schedulingRouter_default
} from "./chunk-GWG5P655.mjs";
import {
  tagRouter_default
} from "./chunk-4HPRUVRE.mjs";
import {
  telephoneRouter_default
} from "./chunk-DPWTD6JW.mjs";
import {
  timeSpanRouter_default
} from "./chunk-SNSY3NOX.mjs";
import {
  timeZoneRouter_default
} from "./chunk-5T45NKWS.mjs";
import {
  vehicleRouter_default
} from "./chunk-HIPSN6P3.mjs";
import {
  guestRouter_default
} from "./chunk-M7CZYJRM.mjs";
import {
  lobbyCalendarRouter_default
} from "./chunk-UMKU3NB5.mjs";
import {
  lobbyProblemRouter_default
} from "./chunk-JNWPKEUF.mjs";
import {
  lobbyRouter_default
} from "./chunk-2PFR7Z67.mjs";
import {
  loggingRouter_default
} from "./chunk-4QWUICRU.mjs";
import {
  memberGroupRouter_default
} from "./chunk-PESP3FIF.mjs";
import {
  memberRouter_default
} from "./chunk-NYGG6EBT.mjs";
import {
  notificationRouter_default
} from "./chunk-SAEFZEXS.mjs";
import {
  controliDRouter_default
} from "./chunk-OKLMUKDN.mjs";
import {
  controllerBrandRouter_default
} from "./chunk-HPBJW6HD.mjs";
import {
  deviceModelRouter_default
} from "./chunk-4CNK4KYU.mjs";
import {
  deviceRouter_default
} from "./chunk-IBH5MTR5.mjs";
import {
  feedbackRouter_default
} from "./chunk-3PYKNI5X.mjs";
import {
  generalDataRouter_default
} from "./chunk-4B5DSNX4.mjs";
import {
  groupAccessRuleRouter_default
} from "./chunk-NLBAVEZB.mjs";
import {
  groupRouter_default
} from "./chunk-JTZZZLCN.mjs";
import "./chunk-V7FQ4JXC.mjs";
import {
  authenticateOperator
} from "./chunk-2TEIS3T3.mjs";
import {
  logging
} from "./chunk-SQBWKTAY.mjs";
import {
  accessRouter_default
} from "./chunk-W7PV7SWX.mjs";
import {
  accessRuleRouter_default
} from "./chunk-IBYSSW3J.mjs";
import {
  accessRuleTimeZoneRouter_default
} from "./chunk-C4TXYZTO.mjs";
import {
  areaAccessRuleRouter_default
} from "./chunk-OFZ3Q7NX.mjs";
import {
  verifyToken
} from "./chunk-JI5AOONO.mjs";
import "./chunk-LRECTTLD.mjs";
import "./chunk-O6QQWDK7.mjs";
import "./chunk-N5A7YI3H.mjs";
import "./chunk-AOUVEGIY.mjs";
import "./chunk-QG6Q6HYV.mjs";
import "./chunk-6KHMAFSH.mjs";
import "./chunk-OVDLKTAO.mjs";
import "./chunk-W22MSNNP.mjs";
import "./chunk-YXAZVKDX.mjs";
import "./chunk-CJDDFBBM.mjs";
import "./chunk-RAU2RGZA.mjs";
import "./chunk-75DSBTFO.mjs";
import "./chunk-KKNRLSHO.mjs";
import "./chunk-3K56DYEE.mjs";
import "./chunk-DEJJPRBX.mjs";
import "./chunk-PXWG5AJJ.mjs";
import "./chunk-VRWGETS4.mjs";
import "./chunk-N3NYV6JB.mjs";
import "./chunk-Q5KE3UIO.mjs";
import "./chunk-RPSIJF36.mjs";
import "./chunk-2PSRWG6C.mjs";
import "./chunk-7NYOTFRW.mjs";
import "./chunk-YNESARUD.mjs";
import "./chunk-E6ACWUJ6.mjs";
import "./chunk-62OVZDAY.mjs";
import "./chunk-JYFV5C2R.mjs";
import "./chunk-2JQF3GBM.mjs";
import "./chunk-FADTVDDG.mjs";
import "./chunk-J5WZO7TA.mjs";
import "./chunk-BXWGZ4DM.mjs";
import "./chunk-BAXCZ7AV.mjs";

// src/app.ts
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
dotenv.config();
var app = express();
app.use(express.json());
app.use(helmet());
var corsOptions = {
  origin: [
    "https://starseg.com",
    "https://starcondomine.starseg.com",
    "https://starcondomineapi.starseg.com",
    "http://localhost:3000"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (request, response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});
app.use("/guest", guestRouter_default);
app.use("/control-id", controliDRouter_default);
app.post("/auth", authenticateOperator);
app.use(verifyToken, logging);
app.use("/operator", operatorRouter_default);
app.use("/access", accessRouter_default);
app.use("/accessRule", accessRuleRouter_default);
app.use("/accessRuleTimeZone", accessRuleTimeZoneRouter_default);
app.use("/areaAccessRule", areaAccessRuleRouter_default);
app.use("/brand", controllerBrandRouter_default);
app.use("/device", deviceRouter_default);
app.use("/deviceModel", deviceModelRouter_default);
app.use("/feedback", feedbackRouter_default);
app.use("/generalData", generalDataRouter_default);
app.use("/group", groupRouter_default);
app.use("/groupAccessRule", groupAccessRuleRouter_default);
app.use("/lobby", lobbyRouter_default);
app.use("/lobbyCalendar", lobbyCalendarRouter_default);
app.use("/lobbyProblem", lobbyProblemRouter_default);
app.use("/log", loggingRouter_default);
app.use("/member", memberRouter_default);
app.use("/memberGroup", memberGroupRouter_default);
app.use("/notification", notificationRouter_default);
app.use("/scheduling", schedulingRouter_default);
app.use("/schedulingList", schedulingListRouter_default);
app.use("/tag", tagRouter_default);
app.use("/telephone", telephoneRouter_default);
app.use("/timeSpan", timeSpanRouter_default);
app.use("/timeZone", timeZoneRouter_default);
app.use("/vehicle", vehicleRouter_default);
app.use("/visitor", visitorRouter_default);
app.use("/visitorGroup", visitorGroupRouter_default);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado!", details: err.message });
});
var port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`\u2728 Servidor rodando na porta ${port} \u2728`);
});
