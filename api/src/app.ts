import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";
import { authenticateOperator } from "./middlewares/auth";
import { logging } from "./middlewares/logging";
import { verifyToken } from "./middlewares/permissions";
import accessRouter from "./routes/accessRouter";
import accessRuleRouter from "./routes/accessRuleRouter";
import accessRuleTimeZoneRouter from "./routes/accessRuleTimeZoneRouter";
import areaAccessRuleRouter from "./routes/areaAccessRuleRouter";
import controliDRouter from "./routes/controliDRouter";
import brandRouter from "./routes/controllerBrandRouter";
import deviceModelRouter from "./routes/deviceModelRouter";
import deviceRouter from "./routes/deviceRouter";
import feedbackRouter from "./routes/feedbackRouter";
import generalDataRouter from "./routes/generalDataRouter";
import groupAccessRuleRouter from "./routes/groupAccessRuleRouter";
import groupRouter from "./routes/groupRouter";
import guestRouter from "./routes/guestRouter";
import lobbyCalendarRouter from "./routes/lobbyCalendarRouter";
import lobbyProblemRouter from "./routes/lobbyProblemRouter";
import lobbyRouter from "./routes/lobbyRouter";
import loggingRouter from "./routes/loggingRouter";
import memberGroupRouter from "./routes/memberGroupRouter";
import memberRouter from "./routes/memberRouter";
import notificationRouter from "./routes/notificationRouter";
import operatorRouter from "./routes/operatorRouter";
import schedulingListRouter from "./routes/schedulingListRouter";
import schedulingRouter from "./routes/schedulingRouter";
import tagRouter from "./routes/tagRouter";
import telephoneRouter from "./routes/telephoneRouter";
import timeSpanRouter from "./routes/timeSpanRouter";
import timeZoneRouter from "./routes/timeZoneRouter";
import vehicleRouter from "./routes/vehicleRouter";
import visitorRouter from "./routes/visitorRouter";
import visitorGroupRouter from "./routes/visitorGroupRouter";
dotenv.config();

const app = express();

app.use(express.json({ limit: 10000000 }));
app.use(express.urlencoded({ limit: 10000000, extended: true }));

app.use(helmet());

const corsOptions = {
  origin: [
    "https://starseg.com",
    "https://starcondomine.starseg.com",
    "https://starcondomineapi.starseg.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

//app.use(bodyParser.json({ limit: "10mb" }));
//app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});

app.use("/guest", guestRouter);
app.use("/control-id", controliDRouter);

app.post("/auth", authenticateOperator);

app.use(verifyToken, logging);

app.use("/operator", operatorRouter);
app.use("/access", accessRouter);
app.use("/accessRule", accessRuleRouter);
app.use("/accessRuleTimeZone", accessRuleTimeZoneRouter);
app.use("/areaAccessRule", areaAccessRuleRouter);
app.use("/brand", brandRouter);
app.use("/device", deviceRouter);
app.use("/deviceModel", deviceModelRouter);
app.use("/feedback", feedbackRouter);
app.use("/generalData", generalDataRouter);
app.use("/group", groupRouter);
app.use("/groupAccessRule", groupAccessRuleRouter);
app.use("/lobby", lobbyRouter);
app.use("/lobbyCalendar", lobbyCalendarRouter);
app.use("/lobbyProblem", lobbyProblemRouter);
app.use("/log", loggingRouter);
app.use("/member", memberRouter);
app.use("/memberGroup", memberGroupRouter);
app.use("/notification", notificationRouter);
app.use("/scheduling", schedulingRouter);
app.use("/schedulingList", schedulingListRouter);
app.use("/tag", tagRouter);
app.use("/telephone", telephoneRouter);
app.use("/timeSpan", timeSpanRouter);
app.use("/timeZone", timeZoneRouter);
app.use("/vehicle", vehicleRouter);
app.use("/visitor", visitorRouter);
app.use("/visitorGroup", visitorGroupRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado!", details: err.message });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
