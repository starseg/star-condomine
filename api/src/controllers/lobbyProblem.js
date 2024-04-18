"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredLobbyProblem = exports.getProblemsByLobby = exports.deleteLobbyProblem = exports.updateLobbyProblem = exports.createLobbyProblem = exports.getLobbyProblem = exports.getAllLobbyProblems = void 0;
const db_1 = __importDefault(require("../db"));
const getAllLobbyProblems = async (req, res) => {
    try {
        const lobbyProblem = await db_1.default.lobbyProblem.findMany();
        res.json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os problemas" });
    }
};
exports.getAllLobbyProblems = getAllLobbyProblems;
const getLobbyProblem = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const lobbyProblem = await db_1.default.lobbyProblem.findUniqueOrThrow({
            where: { lobbyProblemId: id },
        });
        if (!lobbyProblem) {
            res.status(404).json({ error: "Problema não encontrado" });
            return;
        }
        res.json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o problema" });
    }
};
exports.getLobbyProblem = getLobbyProblem;
const createLobbyProblem = async (req, res) => {
    try {
        const { title, description, date, lobbyId, operatorId } = req.body;
        const lobbyProblem = await db_1.default.lobbyProblem.create({
            data: { title, description, date, lobbyId, operatorId },
        });
        res.status(201).json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o problema" });
    }
};
exports.createLobbyProblem = createLobbyProblem;
const updateLobbyProblem = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { title, description, date, status, lobbyId, operatorId } = req.body;
        const lobbyProblem = await db_1.default.lobbyProblem.update({
            where: { lobbyProblemId: id },
            data: { title, description, date, status, lobbyId, operatorId },
        });
        res.status(200).json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o problema" });
    }
};
exports.updateLobbyProblem = updateLobbyProblem;
const deleteLobbyProblem = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.lobbyProblem.delete({
            where: { lobbyProblemId: id },
        });
        res.json({ message: "Problema excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o problema" });
    }
};
exports.deleteLobbyProblem = deleteLobbyProblem;
const getProblemsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const lobbyProblem = await db_1.default.lobbyProblem.findMany({
            where: { lobbyId: lobby },
            include: { operator: true },
            orderBy: [{ status: "asc" }, { date: "desc" }],
        });
        res.json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os problemas" });
    }
};
exports.getProblemsByLobby = getProblemsByLobby;
const getFilteredLobbyProblem = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const lobbyProblem = await db_1.default.lobbyProblem.findMany({
            where: whereCondition,
            include: { operator: true },
            orderBy: [{ status: "asc" }],
        });
        if (!lobbyProblem) {
            res.status(404).json({ error: "Nenhum problema encontrado" });
            return;
        }
        res.json(lobbyProblem);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getFilteredLobbyProblem = getFilteredLobbyProblem;
