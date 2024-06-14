"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredSchedulingLists = exports.deleteSchedulingList = exports.updateSchedulingList = exports.createSchedulingList = exports.getSchedulingList = exports.getAllSchedulingLists = void 0;
const db_1 = __importDefault(require("../db"));
const getAllSchedulingLists = async (req, res) => {
    try {
        const schedulingList = await db_1.default.schedulingList.findMany({
            include: {
                lobby: {
                    select: {
                        name: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                    },
                },
                operator: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        });
        res.json(schedulingList);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os agendamentos" });
    }
};
exports.getAllSchedulingLists = getAllSchedulingLists;
const getSchedulingList = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const schedulingList = await db_1.default.schedulingList.findUniqueOrThrow({
            where: { schedulingListId: id },
            include: {
                member: {
                    select: {
                        name: true,
                    },
                },
                operator: {
                    select: {
                        name: true,
                    },
                },
                lobby: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!schedulingList) {
            res.status(404).json({ error: "Lista não encontrada" });
            return;
        }
        res.json(schedulingList);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a lista" });
    }
};
exports.getSchedulingList = getSchedulingList;
const createSchedulingList = async (req, res) => {
    try {
        const { description, url, lobbyId, memberId, operatorId } = req.body;
        const schedulingList = await db_1.default.schedulingList.create({
            data: {
                description,
                url,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(201).json(schedulingList);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a lista" });
    }
};
exports.createSchedulingList = createSchedulingList;
const updateSchedulingList = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { description, url, status, lobbyId, memberId, operatorId } = req.body;
        const schedulingList = await db_1.default.schedulingList.update({
            where: { schedulingListId: id },
            data: {
                description,
                url,
                status,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(200).json(schedulingList);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a lista" });
    }
};
exports.updateSchedulingList = updateSchedulingList;
const deleteSchedulingList = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.schedulingList.delete({
            where: { schedulingListId: id },
        });
        res.json({ message: "Lista excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a lista" });
    }
};
exports.deleteSchedulingList = deleteSchedulingList;
const getFilteredSchedulingLists = async (req, res) => {
    try {
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { description: { contains: query } },
                    { operator: { name: { contains: query } } },
                    { member: { name: { contains: query } } },
                    { lobby: { name: { contains: query } } },
                ],
            }
            : {};
        const schedulingList = await db_1.default.schedulingList.findMany({
            where: whereCondition,
            include: {
                operator: {
                    select: {
                        name: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                    },
                },
                lobby: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        });
        if (!schedulingList) {
            res.status(404).json({ error: "Nenhum acesso encontrado" });
            return;
        }
        res.json(schedulingList);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getFilteredSchedulingLists = getFilteredSchedulingLists;
