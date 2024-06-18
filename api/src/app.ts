import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { logging } from "./middlewares/logging";
import { verifyToken } from "./middlewares/permissions";
import { authenticateOperator } from "./middlewares/auth";
import accessRouter from "./routes/accessRouter";
import deviceRouter from "./routes/deviceRouter";
import deviceModelRouter from "./routes/deviceModelRouter";
import lobbyCalendarRouter from "./routes/lobbyCalendarRouter";
import lobbyProblemRouter from "./routes/lobbyProblemRouter";
import lobbyRouter from "./routes/lobbyRouter";
import memberRouter from "./routes/memberRouter";
import operatorRouter from "./routes/operatorRouter";
import schedulingRouter from "./routes/schedulingRouter";
import schedulingListRouter from "./routes/schedulingListRouter";
import tagRouter from "./routes/tagRouter";
import telephoneRouter from "./routes/telephoneRouter";
import vehicleRouter from "./routes/vehicleRouter";
import visitorRouter from "./routes/visitorRouter";
import loggingRouter from "./routes/loggingRouter";
import feedbackRouter from "./routes/feedbackRouter";
import notificationRouter from "./routes/notificationRouter";
import guestRouter from "./routes/guestRouter";
import generalDataRouter from "./routes/generalDataRouter";
import brandRouter from "./routes/controllerBrandRouter";
import timeSpanRouter from "./routes/timeSpanRouter";
import timeZoneRouter from "./routes/timeZoneRouter";
import groupRouter from "./routes/groupRouter";
import accessRuleRouter from "./routes/accessRuleRouter";
import memberGroupRouter from "./routes/memberGroupRouter";
import groupAccessRuleRouter from "./routes/groupAccessRuleRouter";
import areaAccessRuleRouter from "./routes/areaAccessRuleRouter";
import accessRuleTimeZoneRouter from "./routes/accessRuleTimeZoneRouter";
dotenv.config();

const app = express();
app.use(express.json());

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

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});

app.use("/guest", guestRouter);

app.post("/auth", authenticateOperator);

app.use(verifyToken, logging);
// app.use();

app.use("/visitor", visitorRouter);
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado!", details: err.message });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
