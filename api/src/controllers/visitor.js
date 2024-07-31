"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredVisitors = exports.getVisitorsByLobby = exports.getVisitorTypes = exports.deleteVisitor = exports.updateVisitor = exports.createVisitor = exports.getVisitor = exports.getAllVisitors = void 0;
const db_1 = __importDefault(require("../db"));
const getAllVisitors = async (req, res) => {
    try {
        const visitor = await db_1.default.visitor.findMany();
        res.json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os visitantes" });
    }
};
exports.getAllVisitors = getAllVisitors;
const getVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const visitor = await db_1.default.visitor.findUniqueOrThrow({
            where: { visitorId: id },
            include: {
                visitorType: true,
                access: {
                    include: { member: { select: { name: true } } },
                },
                scheduling: {
                    include: { member: { select: { name: true } } },
                },
            },
        });
        if (!visitor) {
            res.status(404).json({ error: "Visitante não encontrado" });
            return;
        }
        res.json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o visitante" });
    }
};
exports.getVisitor = getVisitor;
const createVisitor = async (req, res) => {
    try {
        const { profileUrl, documentUrl, name, rg, cpf, phone, startDate, endDate, relation, comments, visitorTypeId, lobbyId, } = req.body;
        const visitor = await db_1.default.visitor.create({
            data: {
                profileUrl,
                documentUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
                comments,
                visitorTypeId,
                lobbyId,
            },
        });
        res.status(201).json(visitor);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.createVisitor = createVisitor;
const updateVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { profileUrl, documentUrl, name, rg, cpf, phone, startDate, endDate, relation, comments, status, visitorTypeId, } = req.body;
        const visitor = await db_1.default.visitor.update({
            where: { visitorId: id },
            data: {
                profileUrl,
                documentUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
                comments,
                status,
                visitorTypeId,
            },
        });
        res.status(200).json(visitor);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.updateVisitor = updateVisitor;
const deleteVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.visitor.delete({
            where: { visitorId: id },
        });
        res.json({ message: "Visitante excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o visitante" });
    }
};
exports.deleteVisitor = deleteVisitor;
const getVisitorTypes = async (req, res) => {
    try {
        const types = await db_1.default.visitorType.findMany();
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos" });
    }
};
exports.getVisitorTypes = getVisitorTypes;
const getVisitorsByLobby = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lobby = parseInt(req.params.lobby, 10);
        const visitor = await db_1.default.visitor.findMany({
            include: {
                visitorType: true,
                access: {
                    select: {
                        endTime: true,
                    },
                    where: {
                        endTime: null,
                    },
                },
                lobby: {
                    select: {
                        exitControl: true,
                    },
                },
                scheduling: {
                    select: {
                        schedulingId: true,
                    },
                    where: {
                        status: "ACTIVE",
                        startDate: {
                            lte: new Date(),
                        },
                        endDate: {
                            gte: today,
                        },
                    },
                },
            },
            where: { lobbyId: lobby },
            orderBy: [{ status: "asc" }, { name: "asc" }],
        });
        res.json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os visitantes" });
    }
};
exports.getVisitorsByLobby = getVisitorsByLobby;
const getFilteredVisitors = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const whereCondition = query
            ? {
                OR: [
                    { cpf: { contains: query } },
                    { rg: { contains: query } },
                    { name: { contains: query } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const visitor = await db_1.default.visitor.findMany({
            where: whereCondition,
            include: {
                visitorType: true,
                access: {
                    select: {
                        endTime: true,
                    },
                    where: {
                        endTime: null,
                    },
                },
                lobby: {
                    select: {
                        exitControl: true,
                    },
                },
                scheduling: {
                    select: {
                        schedulingId: true,
                    },
                    where: {
                        status: "ACTIVE",
                        startDate: {
                            lte: new Date(),
                        },
                        endDate: {
                            gte: today,
                        },
                    },
                },
            },
            orderBy: [{ status: "asc" }, { name: "asc" }],
        });
        if (!visitor) {
            res.status(404).json({ error: "Nenhum visitante encontrado" });
            return;
        }
        res.json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os visitantes" });
    }
};
exports.getFilteredVisitors = getFilteredVisitors;
