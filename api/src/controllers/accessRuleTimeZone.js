"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccessRuleTimeZone = exports.updateAccessRuleTimeZone = exports.createAccessRuleTimeZone = exports.getAccessRuleTimeZonesByLobby = exports.getAccessRuleTimeZone = exports.getAllAccessRuleTimeZones = void 0;
const db_1 = __importDefault(require("../db"));
const getAllAccessRuleTimeZones = async (req, res) => {
    try {
        const accessRuleTimeZone = await db_1.default.accessRuleTimeZone.findMany({
            orderBy: [{ accessRuleTimeZoneId: "asc" }],
            include: {
                timeZone: {
                    select: { name: true },
                },
                accessRule: {
                    select: { name: true },
                },
            },
        });
        res.json(accessRuleTimeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os grupos" });
    }
};
exports.getAllAccessRuleTimeZones = getAllAccessRuleTimeZones;
const getAccessRuleTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const accessRuleTimeZone = await db_1.default.accessRuleTimeZone.findUniqueOrThrow({
            where: { accessRuleTimeZoneId: id },
            include: {
                timeZone: {
                    select: { name: true },
                },
                accessRule: {
                    select: { name: true },
                },
            },
        });
        if (!accessRuleTimeZone) {
            res.status(404).json({ error: "grupo não encontrado" });
            return;
        }
        res.json(accessRuleTimeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o grupo" });
    }
};
exports.getAccessRuleTimeZone = getAccessRuleTimeZone;
const getAccessRuleTimeZonesByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const accessRuleTimeZone = await db_1.default.accessRuleTimeZone.findMany({
            include: {
                timeZone: {
                    select: { name: true },
                },
                accessRule: {
                    select: { name: true },
                },
            },
            where: {
                accessRule: {
                    lobbyId: lobby,
                },
                timeZone: {
                    lobbyId: lobby,
                },
            },
        });
        if (!accessRuleTimeZone) {
            res.status(404).json({ error: "grupo não encontrado" });
            return;
        }
        res.json(accessRuleTimeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o grupo" });
    }
};
exports.getAccessRuleTimeZonesByLobby = getAccessRuleTimeZonesByLobby;
const createAccessRuleTimeZone = async (req, res) => {
    try {
        const { accessRuleId, timeZoneId } = req.body;
        const accessRuleTimeZone = await db_1.default.accessRuleTimeZone.create({
            data: { accessRuleId, timeZoneId },
        });
        res.status(201).json(accessRuleTimeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o grupo" });
    }
};
exports.createAccessRuleTimeZone = createAccessRuleTimeZone;
const updateAccessRuleTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { accessRuleId, timeZoneId } = req.body;
        const accessRuleTimeZone = await db_1.default.accessRuleTimeZone.update({
            where: { accessRuleTimeZoneId: id },
            data: { accessRuleId, timeZoneId },
        });
        res.status(200).json(accessRuleTimeZone);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o grupo" });
    }
};
exports.updateAccessRuleTimeZone = updateAccessRuleTimeZone;
const deleteAccessRuleTimeZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.accessRuleTimeZone.delete({
            where: { accessRuleTimeZoneId: id },
        });
        res.json({ message: "grupo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o grupo" });
    }
};
exports.deleteAccessRuleTimeZone = deleteAccessRuleTimeZone;
