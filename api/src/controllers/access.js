"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.getFilteredAccess = exports.getAccessByLobby = exports.deleteAccess = exports.updateAccess = exports.createAccess = exports.getAccess = exports.getAllAccess = void 0;
const db_1 = __importDefault(require("../db"));
const date_fns_1 = require("date-fns");
const getAllAccess = async (req, res) => {
    try {
        const access = await db_1.default.access.findMany();
        res.json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getAllAccess = getAllAccess;
const getAccess = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const access = await db_1.default.access.findUniqueOrThrow({
            where: { accessId: id },
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
                operator: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!access) {
            res.status(404).json({ error: "Acesso não encontrado" });
            return;
        }
        res.json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o acesso" });
    }
};
exports.getAccess = getAccess;
const createAccess = async (req, res) => {
    try {
        const { startTime, endTime, local, reason, comments, memberId, lobbyId, visitorId, operatorId, } = req.body;
        const access = await db_1.default.access.create({
            data: {
                startTime,
                endTime,
                local,
                reason,
                comments,
                memberId,
                lobbyId,
                visitorId,
                operatorId,
            },
        });
        res.status(201).json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o acesso" });
    }
};
exports.createAccess = createAccess;
const updateAccess = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { startTime, endTime, local, reason, comments, status, memberId, lobbyId, visitorId, operatorId, } = req.body;
        const access = await db_1.default.access.update({
            where: { accessId: id },
            data: {
                startTime,
                endTime,
                local,
                reason,
                comments,
                status,
                memberId,
                lobbyId,
                visitorId,
                operatorId,
            },
        });
        res.status(200).json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o acesso" });
    }
};
exports.updateAccess = updateAccess;
const deleteAccess = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.access.delete({
            where: { accessId: id },
        });
        res.json({ message: "Acesso excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o acesso" });
    }
};
exports.deleteAccess = deleteAccess;
const getAccessByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const oneMonthAgo = (0, date_fns_1.subDays)(new Date(), 31);
        const access = await db_1.default.access.findMany({
            where: {
                lobbyId: lobby,
                startTime: {
                    gte: oneMonthAgo,
                },
            },
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
            orderBy: [{ status: "asc" }, { startTime: "desc" }],
        });
        res.json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getAccessByLobby = getAccessByLobby;
const getFilteredAccess = async (req, res) => {
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
        const access = await db_1.default.access.findMany({
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
            orderBy: [{ status: "asc" }, { endTime: "asc" }, { startTime: "desc" }],
        });
        if (!access) {
            res.status(404).json({ error: "Nenhum acesso encontrado" });
            return;
        }
        res.json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getFilteredAccess = getFilteredAccess;
const generateReport = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { from, to } = req.query;
        if (!from || !to) {
            const resultWithoutDate = await db_1.default.access.findMany({
                where: {
                    lobbyId: lobby,
                },
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
                orderBy: [{ startTime: "asc" }],
            });
            res.json(resultWithoutDate);
            return;
        }
        const fromObj = from ? new Date(from) : undefined;
        const toObj = to ? new Date(to) : undefined;
        // Certifique-se de que as datas são válidas, se fornecidas
        if ((fromObj && isNaN(fromObj.getTime())) ||
            (toObj && isNaN(toObj.getTime()))) {
            res.status(400).json({ error: "As datas fornecidas não são válidas" });
            return;
        }
        const access = await db_1.default.access.findMany({
            where: {
                lobbyId: lobby,
                ...(fromObj && toObj
                    ? {
                        startTime: {
                            gte: fromObj,
                            lte: toObj,
                        },
                    }
                    : {}),
            },
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
                lobby: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ startTime: "asc" }],
        });
        res.json(access);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.generateReport = generateReport;
