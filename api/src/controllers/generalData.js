"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countAccessesPerHour = exports.accessesByOperator = exports.problemsByLobby = exports.accessesByLobby = exports.count = void 0;
const db_1 = __importDefault(require("../db"));
const client_1 = require("@prisma/client");
const count = async (req, res) => {
    try {
        const [lobbies, members, visitors, accesses, schedulings, vehicles, devices, problems, solvedProblems,] = await Promise.all([
            db_1.default.lobby.count(),
            db_1.default.member.count(),
            db_1.default.visitor.count(),
            db_1.default.access.count(),
            db_1.default.scheduling.count(),
            db_1.default.vehicle.count(),
            db_1.default.device.count(),
            db_1.default.lobbyProblem.count(),
            db_1.default.lobbyProblem.count({
                where: {
                    status: "INACTIVE",
                },
            }),
        ]);
        const data = {
            lobbies,
            members,
            visitors,
            accesses,
            schedulings,
            vehicles,
            devices,
            problems,
            solvedProblems,
        };
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados" });
    }
};
exports.count = count;
const accessesByLobby = async (req, res) => {
    try {
        const count = await db_1.default.access.groupBy({
            by: ["lobbyId"],
            _count: true,
        });
        const lobbies = await db_1.default.lobby.findMany({
            select: {
                lobbyId: true,
                name: true,
            },
        });
        const accesses = [];
        count.map((item) => {
            accesses.push({
                lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
                count: item._count,
            });
        });
        res.json(accesses);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados" });
    }
};
exports.accessesByLobby = accessesByLobby;
const problemsByLobby = async (req, res) => {
    try {
        const count = await db_1.default.lobbyProblem.groupBy({
            by: ["lobbyId"],
            _count: true,
        });
        const lobbies = await db_1.default.lobby.findMany({
            select: {
                lobbyId: true,
                name: true,
            },
        });
        const problems = [];
        count.map((item) => {
            problems.push({
                lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
                count: item._count,
            });
        });
        res.json(problems);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados" });
    }
};
exports.problemsByLobby = problemsByLobby;
const accessesByOperator = async (req, res) => {
    try {
        const count = await db_1.default.access.groupBy({
            by: ["operatorId"],
            _count: true,
        });
        const operators = await db_1.default.operator.findMany({
            select: {
                operatorId: true,
                name: true,
            },
        });
        const accesses = [];
        count.map((item) => {
            accesses.push({
                operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
                count: item._count,
            });
        });
        res.json(accesses);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados" });
    }
};
exports.accessesByOperator = accessesByOperator;
const countAccessesPerHour = async (req, res) => {
    try {
        // Ajustar o fuso horário (UTC -3)
        const adjustedTimeQuery = client_1.Prisma.sql `DATE_SUB(startTime, INTERVAL 3 HOUR)`;
        // Agrupar por hora e contar acessos
        const results = await db_1.default.$queryRaw(client_1.Prisma.sql `
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) as hour, 
        COUNT(*) as count
      FROM Access
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);
        // Converting BigInt counts to number
        const totalAccesses = results.reduce((sum, record) => sum + Number(record.count), 0);
        const numberOfHours = results.length;
        const averageAccessesPerHour = numberOfHours > 0 ? totalAccesses / numberOfHours : 0;
        // Enviar resposta
        res.json({
            averageAccessesPerHour,
            hourlyCounts: results.map((result) => ({
                ...result,
                count: Number(result.count),
            })),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
exports.countAccessesPerHour = countAccessesPerHour;
