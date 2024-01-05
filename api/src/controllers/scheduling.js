"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredSchedulings = exports.getSchedulingsByLobby = exports.deleteScheduling = exports.updateScheduling = exports.createScheduling = exports.getScheduling = exports.getAllSchedules = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllSchedules = async (req, res) => {
    try {
        const scheduling = await prisma.scheduling.findMany();
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os agendamentos" });
    }
};
exports.getAllSchedules = getAllSchedules;
const getScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const scheduling = await prisma.scheduling.findUniqueOrThrow({
            where: { schedulingId: id },
            include: {
                visitor: {
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
        });
        if (!scheduling) {
            res.status(404).json({ error: "Agendamento não encontrado" });
            return;
        }
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o agendamento" });
    }
};
exports.getScheduling = getScheduling;
const createScheduling = async (req, res) => {
    try {
        const { reason, location, startDate, endDate, visitorId, lobbyId, memberId, operatorId, } = req.body;
        const scheduling = await prisma.scheduling.create({
            data: {
                reason,
                location,
                startDate,
                endDate,
                visitorId,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(201).json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o agendamento" });
    }
};
exports.createScheduling = createScheduling;
const updateScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { reason, location, startDate, endDate, status, visitorId, lobbyId, memberId, operatorId, } = req.body;
        const scheduling = await prisma.scheduling.update({
            where: { schedulingId: id },
            data: {
                reason,
                location,
                startDate,
                endDate,
                status,
                visitorId,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(200).json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o agendamento" });
    }
};
exports.updateScheduling = updateScheduling;
const deleteScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.scheduling.delete({
            where: { schedulingId: id },
        });
        res.json({ message: "Agendamento excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o agendamento" });
    }
};
exports.deleteScheduling = deleteScheduling;
const getSchedulingsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const scheduling = await prisma.scheduling.findMany({
            where: { lobbyId: lobby },
            include: {
                visitor: {
                    select: {
                        name: true,
                        cpf: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                        cpf: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }],
        });
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getSchedulingsByLobby = getSchedulingsByLobby;
const getFilteredSchedulings = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { visitor: { name: { contains: query } } },
                    { member: { name: { contains: query } } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const scheduling = await prisma.scheduling.findMany({
            where: whereCondition,
            include: {
                visitor: {
                    select: {
                        name: true,
                        cpf: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                        cpf: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }],
        });
        if (!scheduling) {
            res.status(404).json({ error: "Nenhum acesso encontrado" });
            return;
        }
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getFilteredSchedulings = getFilteredSchedulings;
