"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimeZone = exports.updateTimeZone = exports.createTimeZone = exports.getTimeZone = exports.getTimeZonesByLobby = exports.getAllTimeZones = void 0;
const db_1 = __importDefault(require("../db"));
const getAllTimeZones = async (req, res) => {
    try {
        const timeZone = await db_1.default.timeZone.findMany({
            orderBy: [{ timeZoneId: "asc" }],
        });
        res.json(timeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os TimeZones" });
    }
};
exports.getAllTimeZones = getAllTimeZones;
const getTimeZonesByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const timeZone = await db_1.default.timeZone.findMany({
            where: { lobbyId: lobby },
            orderBy: [{ timeZoneId: "asc" }],
        });
        res.json(timeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os TimeZones" });
    }
};
exports.getTimeZonesByLobby = getTimeZonesByLobby;
const getTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const timeZone = await db_1.default.timeZone.findUniqueOrThrow({
            where: { timeZoneId: id },
        });
        if (!timeZone) {
            res.status(404).json({ error: "TimeZone não encontrado" });
            return;
        }
        res.json(timeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o TimeZone" });
    }
};
exports.getTimeZone = getTimeZone;
const createTimeZone = async (req, res) => {
    try {
        const { name, lobbyId } = req.body;
        const timeZone = await db_1.default.timeZone.create({
            data: { name, lobbyId },
        });
        res.status(201).json(timeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o TimeZone" });
    }
};
exports.createTimeZone = createTimeZone;
const updateTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, lobbyId } = req.body;
        const timeZone = await db_1.default.timeZone.update({
            where: { timeZoneId: id },
            data: { name, lobbyId },
        });
        res.status(200).json(timeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o timeZone" });
    }
};
exports.updateTimeZone = updateTimeZone;
const deleteTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.timeZone.delete({
            where: { timeZoneId: id },
        });
        res.json({ message: "timeZone excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o timeZone" });
    }
};
exports.deleteTimeZone = deleteTimeZone;
