"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLobby = exports.updateLobby = exports.createLobby = exports.getLobby = exports.getFilteredLobbies = exports.getAllLobbies = void 0;
const db_1 = __importDefault(require("../db"));
const getAllLobbies = async (req, res) => {
    try {
        const lobby = await db_1.default.lobby.findMany({
            orderBy: [{ name: "asc" }],
            include: {
                device: true,
                lobbyProblem: true,
                ControllerBrand: true,
            },
        });
        res.json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as portarias" });
    }
};
exports.getAllLobbies = getAllLobbies;
const getFilteredLobbies = async (req, res) => {
    try {
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { name: { contains: query } },
                    { city: { contains: query } },
                    { state: { contains: query } },
                ],
            }
            : {};
        const lobbies = await db_1.default.lobby.findMany({
            where: whereCondition,
            include: {
                device: true,
                lobbyProblem: true,
                ControllerBrand: true,
            },
            orderBy: [{ name: "asc" }],
        });
        res.json(lobbies);
    }
    catch (error) {
        console.error("Erro na busca da portaria:", error);
        res.status(500).json({ error: "Erro na busca da portaria" });
    }
};
exports.getFilteredLobbies = getFilteredLobbies;
const getLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const lobby = await db_1.default.lobby.findUniqueOrThrow({
            where: { lobbyId: id },
            include: {
                ControllerBrand: true,
                device: true,
            },
        });
        if (!lobby) {
            res.status(404).json({ error: "Portaria não encontrada" });
            return;
        }
        res.json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a portaria" });
    }
};
exports.getLobby = getLobby;
const createLobby = async (req, res) => {
    try {
        const { cnpj, name, responsible, telephone, schedules, exitControl, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, code, type, controllerBrandId, } = req.body;
        const lobby = await db_1.default.lobby.create({
            data: {
                cnpj,
                name,
                responsible,
                telephone,
                schedules,
                exitControl,
                procedures,
                datasheet,
                cep,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                code,
                type,
                controllerBrandId,
            },
        });
        res.status(201).json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a portaria" });
    }
};
exports.createLobby = createLobby;
const updateLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { cnpj, name, responsible, telephone, schedules, exitControl, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, code, type, controllerBrandId, } = req.body;
        const lobby = await db_1.default.lobby.update({
            where: { lobbyId: id },
            data: {
                cnpj,
                name,
                responsible,
                telephone,
                schedules,
                exitControl,
                procedures,
                datasheet,
                cep,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                code,
                type,
                controllerBrandId,
            },
        });
        res.status(200).json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a portaria" });
    }
};
exports.updateLobby = updateLobby;
const deleteLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.lobby.delete({
            where: { lobbyId: id },
        });
        res.json({ message: "Portaria excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a portaria" });
    }
};
exports.deleteLobby = deleteLobby;
