"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogging = exports.createLogging = exports.getLogging = exports.getAllLoggings = void 0;
const db_1 = __importDefault(require("../db"));
const getAllLoggings = async (req, res) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const formattedDate = date.toISOString();
        const logging = await db_1.default.logging.findMany({
            where: {
                date: {
                    gte: formattedDate,
                },
            },
            include: {
                operator: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ date: "desc" }],
        });
        res.json(logging);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os registros" });
    }
};
exports.getAllLoggings = getAllLoggings;
const getLogging = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const logging = await db_1.default.logging.findUniqueOrThrow({
            where: { logId: id },
        });
        if (!logging) {
            res.status(404).json({ error: "Registro não encontrado" });
            return;
        }
        res.json(logging);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o registro" });
    }
};
exports.getLogging = getLogging;
const createLogging = async (method, url, userAgent, operatorId) => {
    try {
        const logging = await db_1.default.logging.create({
            data: { method, url, userAgent, operatorId },
        });
        // console.log("Registro de logging criado:", logging);
    }
    catch (error) {
        console.error("Erro ao criar o registro de logging:", error);
        throw error; // Propaga o erro para o chamador, se necessário
    }
};
exports.createLogging = createLogging;
const deleteLogging = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.logging.delete({
            where: { logId: id },
        });
        res.json({ message: "Registro excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o registro" });
    }
};
exports.deleteLogging = deleteLogging;
