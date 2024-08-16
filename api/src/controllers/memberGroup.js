"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemberGroup = exports.updateMemberGroup = exports.createMemberGroup = exports.getMemberGroupsByLobby = exports.getMemberGroup = exports.getAllMemberGroups = void 0;
const db_1 = __importDefault(require("../db"));
const getAllMemberGroups = async (req, res) => {
    try {
        const memberGroup = await db_1.default.memberGroup.findMany({
            orderBy: [{ memberGroupId: "asc" }],
            include: {
                member: {
                    select: { name: true },
                },
                group: {
                    select: { name: true },
                },
            },
        });
        res.json(memberGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relações" });
    }
};
exports.getAllMemberGroups = getAllMemberGroups;
const getMemberGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const memberGroup = await db_1.default.memberGroup.findUniqueOrThrow({
            where: { memberGroupId: id },
            include: {
                member: {
                    select: { name: true },
                },
                group: {
                    select: { name: true },
                },
            },
        });
        if (!memberGroup) {
            res.status(404).json({ error: "relação não encontrada" });
            return;
        }
        res.json(memberGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relação" });
    }
};
exports.getMemberGroup = getMemberGroup;
const getMemberGroupsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const memberGroup = await db_1.default.memberGroup.findMany({
            orderBy: [{ memberGroupId: "asc" }],
            include: {
                member: {
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
                member: {
                    lobbyId: lobby,
                },
            },
        });
        res.json(memberGroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar relações" });
    }
};
exports.getMemberGroupsByLobby = getMemberGroupsByLobby;
const createMemberGroup = async (req, res) => {
    try {
        const { memberId, groupId } = req.body;
        const membergroup = await db_1.default.memberGroup.create({
            data: { memberId, groupId },
        });
        res.status(201).json(membergroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar relação" });
    }
};
exports.createMemberGroup = createMemberGroup;
const updateMemberGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { memberId, groupId } = req.body;
        const membergroup = await db_1.default.memberGroup.update({
            where: { memberGroupId: id },
            data: { memberId, groupId },
        });
        res.status(200).json(membergroup);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar relação" });
    }
};
exports.updateMemberGroup = updateMemberGroup;
const deleteMemberGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.memberGroup.delete({
            where: { memberGroupId: id },
        });
        res.json({ message: "relação excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir relação" });
    }
};
exports.deleteMemberGroup = deleteMemberGroup;
