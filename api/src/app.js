"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const logging_1 = require("./middlewares/logging");
const permissions_1 = require("./middlewares/permissions");
const auth_1 = require("./middlewares/auth");
const accessRouter_1 = __importDefault(require("./routes/accessRouter"));
const deviceRouter_1 = __importDefault(require("./routes/deviceRouter"));
const deviceModelRouter_1 = __importDefault(require("./routes/deviceModelRouter"));
const lobbyCalendarRouter_1 = __importDefault(require("./routes/lobbyCalendarRouter"));
const lobbyProblemRouter_1 = __importDefault(require("./routes/lobbyProblemRouter"));
const lobbyRouter_1 = __importDefault(require("./routes/lobbyRouter"));
const memberRouter_1 = __importDefault(require("./routes/memberRouter"));
const operatorRouter_1 = __importDefault(require("./routes/operatorRouter"));
const schedulingRouter_1 = __importDefault(require("./routes/schedulingRouter"));
const schedulingListRouter_1 = __importDefault(require("./routes/schedulingListRouter"));
const tagRouter_1 = __importDefault(require("./routes/tagRouter"));
const telephoneRouter_1 = __importDefault(require("./routes/telephoneRouter"));
const vehicleRouter_1 = __importDefault(require("./routes/vehicleRouter"));
const visitorRouter_1 = __importDefault(require("./routes/visitorRouter"));
const loggingRouter_1 = __importDefault(require("./routes/loggingRouter"));
const feedbackRouter_1 = __importDefault(require("./routes/feedbackRouter"));
const notificationRouter_1 = __importDefault(require("./routes/notificationRouter"));
const guestRouter_1 = __importDefault(require("./routes/guestRouter"));
const generalDataRouter_1 = __importDefault(require("./routes/generalDataRouter"));
const controllerBrandRouter_1 = __importDefault(require("./routes/controllerBrandRouter"));
const timeSpanRouter_1 = __importDefault(require("./routes/timeSpanRouter"));
const timeZoneRouter_1 = __importDefault(require("./routes/timeZoneRouter"));
const groupRouter_1 = __importDefault(require("./routes/groupRouter"));
const accessRuleRouter_1 = __importDefault(require("./routes/accessRuleRouter"));
const memberGroupRouter_1 = __importDefault(require("./routes/memberGroupRouter"));
const groupAccessRuleRouter_1 = __importDefault(require("./routes/groupAccessRuleRouter"));
const areaAccessRuleRouter_1 = __importDefault(require("./routes/areaAccessRuleRouter"));
const accessRuleTimeZoneRouter_1 = __importDefault(require("./routes/accessRuleTimeZoneRouter"));
const controliDRouter_1 = __importDefault(require("./routes/controliDRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
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
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (request, response) => {
    response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});
app.use("/guest", guestRouter_1.default);
app.use("/control-id", controliDRouter_1.default);
app.post("/auth", auth_1.authenticateOperator);
app.use(permissions_1.verifyToken, logging_1.logging);
app.use("/visitor", visitorRouter_1.default);
app.use("/operator", operatorRouter_1.default);
app.use("/access", accessRouter_1.default);
app.use("/accessRule", accessRuleRouter_1.default);
app.use("/accessRuleTimeZone", accessRuleTimeZoneRouter_1.default);
app.use("/areaAccessRule", areaAccessRuleRouter_1.default);
app.use("/brand", controllerBrandRouter_1.default);
app.use("/device", deviceRouter_1.default);
app.use("/deviceModel", deviceModelRouter_1.default);
app.use("/feedback", feedbackRouter_1.default);
app.use("/generalData", generalDataRouter_1.default);
app.use("/group", groupRouter_1.default);
app.use("/groupAccessRule", groupAccessRuleRouter_1.default);
app.use("/lobby", lobbyRouter_1.default);
app.use("/lobbyCalendar", lobbyCalendarRouter_1.default);
app.use("/lobbyProblem", lobbyProblemRouter_1.default);
app.use("/log", loggingRouter_1.default);
app.use("/member", memberRouter_1.default);
app.use("/memberGroup", memberGroupRouter_1.default);
app.use("/notification", notificationRouter_1.default);
app.use("/scheduling", schedulingRouter_1.default);
app.use("/schedulingList", schedulingListRouter_1.default);
app.use("/tag", tagRouter_1.default);
app.use("/telephone", telephoneRouter_1.default);
app.use("/timeSpan", timeSpanRouter_1.default);
app.use("/timeZone", timeZoneRouter_1.default);
app.use("/vehicle", vehicleRouter_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Algo deu errado!", details: err.message });
});
const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
