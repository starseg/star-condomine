"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimeSpan = exports.updateTimeSpan = exports.createTimeSpan = exports.getTimeSpan = exports.getAllTimeSpans = void 0;
const db_1 = __importDefault(require("../db"));
const getAllTimeSpans = async (req, res) => {
    try {
        const timeSpan = await db_1.default.timeSpan.findMany({
            orderBy: [{ timeSpanId: "asc" }],
            include: { timeZone: true },
        });
        res.json(timeSpan);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os TimeSpans" });
    }
};
exports.getAllTimeSpans = getAllTimeSpans;
const getTimeSpan = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const timeSpan = await db_1.default.timeSpan.findUniqueOrThrow({
            where: { timeSpanId: id },
            include: { timeZone: true },
        });
        if (!timeSpan) {
            res.status(404).json({ error: "TimeSpan não encontrado" });
            return;
        }
        res.json(timeSpan);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o TimeSpan" });
    }
};
exports.getTimeSpan = getTimeSpan;
const createTimeSpan = async (req, res) => {
    try {
        const { start, end, sun, mon, tue, wed, thu, fri, sat, hol1, hol2, hol3, timeZoneId, } = req.body;
        const timeSpan = await db_1.default.timeSpan.create({
            data: {
                start,
                end,
                sun,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                hol1,
                hol2,
                hol3,
                timeZoneId,
            },
        });
        res.status(201).json(timeSpan);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o TimeSpan" });
    }
};
exports.createTimeSpan = createTimeSpan;
const updateTimeSpan = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { start, end, sun, mon, tue, wed, thu, fri, sat, hol1, hol2, hol3, timeZoneId, } = req.body;
        const timeSpan = await db_1.default.timeSpan.update({
            where: { timeSpanId: id },
            data: {
                start,
                end,
                sun,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                hol1,
                hol2,
                hol3,
                timeZoneId,
            },
        });
        res.status(200).json(timeSpan);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o timeSpan" });
    }
};
exports.updateTimeSpan = updateTimeSpan;
const deleteTimeSpan = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.timeSpan.delete({
            where: { timeSpanId: id },
        });
        res.json({ message: "timeSpan excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o timeSpan" });
    }
};
exports.deleteTimeSpan = deleteTimeSpan;
