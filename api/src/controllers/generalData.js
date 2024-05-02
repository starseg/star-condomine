"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countAccessesPerHour = exports.problemsByLobby = exports.accessesByLobby = exports.count = void 0;
const db_1 = __importDefault(require("../db"));
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
const countAccessesPerHour = async (req, res) => {
    const { day, from, to } = req.query;
    const dayObj = day ? new Date(day) : undefined;
    if (dayObj && isNaN(dayObj.getTime())) {
        res.status(400).json({ error: "A data fornecida não é válida" });
        return;
    }
    const logs = await db_1.default.logging.findMany({
        where: {
            url: { startsWith: "/access" },
        },
    });
    logs.map((log) => {
        let hour = log.date.getHours() - 3;
        if (hour) {
        }
    });
};
exports.countAccessesPerHour = countAccessesPerHour;
