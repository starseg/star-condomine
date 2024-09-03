"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitorGroup = exports.updateVisitorGroup = exports.createVisitorGroup = exports.getVisitorGroupsByLobby = exports.getVisitorGroup = exports.getAllVisitorGroups = void 0;
const db_1 = __importDefault(require("../db"));
const getAllVisitorGroups = async (req, res) => {
    try {
        const visitorGroup = await db_1.default.visitorGroup.findMany({
            orderBy: [{ visitorGroupId: "asc" }],
            include: {
                visitor: {
                    select: { name: true },
                },
                group: {
                    select: { name: true },
                },
            },
        });
        res.json(visitorGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relações" });
    }
};
exports.getAllVisitorGroups = getAllVisitorGroups;
const getVisitorGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const visitorGroup = await db_1.default.visitorGroup.findUniqueOrThrow({
            where: { visitorGroupId: id },
            include: {
                visitor: {
                    select: { name: true },
                },
                group: {
                    select: { name: true },
                },
            },
        });
        if (!visitorGroup) {
            res.status(404).json({ error: "relação não encontrada" });
            return;
        }
        res.json(visitorGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relação" });
    }
};
exports.getVisitorGroup = getVisitorGroup;
const getVisitorGroupsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const visitorGroup = await db_1.default.visitorGroup.findMany({
            orderBy: [{ visitorGroupId: "asc" }],
            include: {
                visitor: {
                    select: { name: true },
                },
                group: {
                    select: { name: true },
                },
            },
            where: {
                group: {
                    lobbyId: lobby,
                },
                visitor: {
                    lobbyId: lobby,
                },
            },
        });
        res.json(visitorGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relações" });
    }
};
exports.getVisitorGroupsByLobby = getVisitorGroupsByLobby;
const createVisitorGroup = async (req, res) => {
    try {
        const { visitorId, groupId } = req.body;
        const visitorgroup = await db_1.default.visitorGroup.create({
            data: { visitorId, groupId },
        });
        res.status(201).json(visitorgroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar relação" });
    }
};
exports.createVisitorGroup = createVisitorGroup;
const updateVisitorGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { visitorId, groupId } = req.body;
        const visitorgroup = await db_1.default.visitorGroup.update({
            where: { visitorGroupId: id },
            data: { visitorId, groupId },
        });
        res.status(200).json(visitorgroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar relação" });
    }
};
exports.updateVisitorGroup = updateVisitorGroup;
const deleteVisitorGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.visitorGroup.delete({
            where: { visitorGroupId: id },
        });
        res.json({ message: "relação excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir relação" });
    }
};
exports.deleteVisitorGroup = deleteVisitorGroup;
