"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarByLobby = exports.deleteLobbyCalendar = exports.updateLobbyCalendar = exports.createLobbyCalendar = exports.getLobbyCalendar = exports.getAllLobbyCalendars = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllLobbyCalendars = async (req, res) => {
    try {
        const lobbyCalendar = await prisma.lobbyCalendar.findMany();
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
        const lobbyCalendar = await prisma.lobbyCalendar.findUniqueOrThrow({
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
        const lobbyCalendar = await prisma.lobbyCalendar.create({
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
        const lobbyCalendar = await prisma.lobbyCalendar.update({
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
        await prisma.lobbyCalendar.delete({
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
        const lobbyCalendar = await prisma.lobbyCalendar.findMany({
            where: { lobbyId: lobby },
        });
        res.json(lobbyCalendar);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o calendário" });
    }
};
exports.getCalendarByLobby = getCalendarByLobby;
