"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCalendar = exports.getTodaysHoliday = exports.getCalendarByLobby = exports.deleteLobbyCalendar = exports.updateLobbyCalendar = exports.createLobbyCalendar = exports.getLobbyCalendar = exports.getAllLobbyCalendars = void 0;
const db_1 = __importDefault(require("../db"));
const getAllLobbyCalendars = async (req, res) => {
    try {
        const lobbyCalendar = await db_1.default.lobbyCalendar.findMany();
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as datas" });
    }
};
exports.getAllLobbyCalendars = getAllLobbyCalendars;
const getLobbyCalendar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const lobbyCalendar = await db_1.default.lobbyCalendar.findUniqueOrThrow({
            where: { lobbyCalendarId: id },
        });
        if (!lobbyCalendar) {
            res.status(404).json({ error: "data não encontrada" });
            return;
        }
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a data" });
    }
};
exports.getLobbyCalendar = getLobbyCalendar;
const createLobbyCalendar = async (req, res) => {
    try {
        const { description, date, lobbyId } = req.body;
        const lobbyCalendar = await db_1.default.lobbyCalendar.create({
            data: { description, date, lobbyId },
        });
        res.status(201).json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a data" });
    }
};
exports.createLobbyCalendar = createLobbyCalendar;
const updateLobbyCalendar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { description, date, lobbyId } = req.body;
        const lobbyCalendar = await db_1.default.lobbyCalendar.update({
            where: { lobbyCalendarId: id },
            data: { description, date, lobbyId },
        });
        res.status(200).json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a data" });
    }
};
exports.updateLobbyCalendar = updateLobbyCalendar;
const deleteLobbyCalendar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.lobbyCalendar.delete({
            where: { lobbyCalendarId: id },
        });
        res.json({ message: "data excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a data" });
    }
};
exports.deleteLobbyCalendar = deleteLobbyCalendar;
const getCalendarByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const lobbyCalendar = await db_1.default.lobbyCalendar.findMany({
            where: { lobbyId: lobby },
            orderBy: [{ date: "asc" }],
        });
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o calendário" });
    }
};
exports.getCalendarByLobby = getCalendarByLobby;
const getTodaysHoliday = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lobbyCalendar = await db_1.default.lobbyCalendar.findMany({
            where: {
                lobbyId: lobby,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a data" });
    }
};
exports.getTodaysHoliday = getTodaysHoliday;
const getFilteredCalendar = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [{ description: { contains: query } }],
                AND: { lobbyId: lobby },
            }
            : {};
        const lobbyCalendar = await db_1.default.lobbyCalendar.findMany({
            where: whereCondition,
            orderBy: [{ date: "asc" }],
        });
        if (!lobbyCalendar) {
            res.status(404).json({ error: "Nenhuma data encontrada" });
            return;
        }
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as datas" });
    }
};
exports.getFilteredCalendar = getFilteredCalendar;
