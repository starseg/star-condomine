"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredVisitors = exports.getVisitorsByLobby = exports.getVisitorTypes = exports.deleteVisitor = exports.updateVisitor = exports.createVisitor = exports.getVisitor = exports.getAllVisitors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllVisitors = async (req, res) => {
    try {
        const visitor = await prisma.visitor.findMany();
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
        const visitor = await prisma.visitor.findUniqueOrThrow({
            where: { visitorId: id },
            include: { visitorType: true },
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
        const { profileUrl, name, rg, cpf, phone, startDate, endDate, relation, visitorTypeId, lobbyId, } = req.body;
        const visitor = await prisma.visitor.create({
            data: {
                profileUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
                visitorTypeId,
                lobbyId,
            },
        });
        res.status(201).json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o visitante" });
    }
};
exports.createVisitor = createVisitor;
const updateVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { profileUrl, name, rg, cpf, phone, startDate, endDate, relation, status, visitorTypeId, } = req.body;
        const visitor = await prisma.visitor.update({
            where: { visitorId: id },
            data: {
                profileUrl,
                name,
                rg,
                cpf,
                phone,
                startDate,
                endDate,
                relation,
                status,
                visitorTypeId,
            },
        });
        res.status(200).json(visitor);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o visitante" });
    }
};
exports.updateVisitor = updateVisitor;
const deleteVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.visitor.delete({
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
        const types = await prisma.visitorType.findMany();
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os tipos" });
    }
};
exports.getVisitorTypes = getVisitorTypes;
const getVisitorsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const visitor = await prisma.visitor.findMany({
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
        const whereCondition = query
            ? {
                OR: [
                    { cpf: { contains: query } },
                    { name: { contains: query } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const visitor = await prisma.visitor.findMany({
            where: whereCondition,
            include: { visitorType: true },
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
