"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = void 0;
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
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.count = count;
