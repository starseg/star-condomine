"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logging = void 0;
const logging_1 = require("../controllers/logging");
const logging = async (req, res, next) => {
    try {
        const { method, url, headers, operator } = req;
        const userAgent = headers["user-agent"] || "Desconhecido";
        const operatorId = operator.user.id;
        // Registra as informações no banco de dados
        if (method !== "GET" && !url.startsWith("/log"))
            await (0, logging_1.createLogging)(method, url, userAgent, operatorId);
        // console.log(method, url, operatorId);
        // Continue para a próxima middleware ou rota
        next();
    }
    catch (error) {
        console.error("Erro ao criar o registro de logging:", error);
        res.status(500).json({ error: "Erro ao criar o registro" });
    }
};
exports.logging = logging;
