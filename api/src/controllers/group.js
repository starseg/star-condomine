"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.updateGroup = exports.createGroup = exports.getGroupsByLobby = exports.getGroup = exports.getAllGroups = void 0;
const db_1 = __importDefault(require("../db"));
const getAllGroups = async (req, res) => {
    try {
        const group = await db_1.default.group.findMany({
            orderBy: [{ groupId: "asc" }],
        });
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os grupos" });
    }
};
exports.getAllGroups = getAllGroups;
const getGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const group = await db_1.default.group.findUniqueOrThrow({
            where: { groupId: id },
        });
        if (!group) {
            res.status(404).json({ error: "grupo não encontrado" });
            return;
        }
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o grupo" });
    }
};
exports.getGroup = getGroup;
const getGroupsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const group = await db_1.default.group.findMany({
            where: { lobbyId: lobby },
            orderBy: [{ groupId: "asc" }],
        });
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os grupos" });
    }
};
exports.getGroupsByLobby = getGroupsByLobby;
const createGroup = async (req, res) => {
    try {
        const { name, lobbyId } = req.body;
        const group = await db_1.default.group.create({
            data: { name, lobbyId },
        });
        res.status(201).json(group);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o grupo" });
    }
};
exports.createGroup = createGroup;
const updateGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, lobbyId } = req.body;
        const group = await db_1.default.group.update({
            where: { groupId: id },
            data: { name, lobbyId },
        });
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o grupo" });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.group.delete({
            where: { groupId: id },
        });
        res.json({ message: "grupo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o grupo" });
    }
};
exports.deleteGroup = deleteGroup;
