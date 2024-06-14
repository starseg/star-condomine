"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredVehicles = exports.getVehiclesByLobby = exports.getVehicleTypes = exports.getVehiclesByOwner = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicle = exports.getAllVehicles = void 0;
const db_1 = __importDefault(require("../db"));
const getAllVehicles = async (req, res) => {
    try {
        const vehicle = await db_1.default.vehicle.findMany({
            include: {
                member: true,
                vehicleType: true,
            },
        });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getAllVehicles = getAllVehicles;
const getVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const vehicle = await db_1.default.vehicle.findUniqueOrThrow({
            where: { vehicleId: id },
        });
        if (!vehicle) {
            res.status(404).json({ error: "Veículo não encontrado" });
            return;
        }
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o veículo" });
    }
};
exports.getVehicle = getVehicle;
const createVehicle = async (req, res) => {
    try {
        const { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId, lobbyId, } = req.body;
        const vehicle = await db_1.default.vehicle.create({
            data: {
                licensePlate,
                brand,
                model,
                color,
                tag,
                comments,
                vehicleTypeId,
                memberId,
                lobbyId,
            },
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o veículo" });
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId, } = req.body;
        const vehicle = await db_1.default.vehicle.update({
            where: { vehicleId: id },
            data: {
                licensePlate,
                brand,
                model,
                color,
                tag,
                comments,
                vehicleTypeId,
                memberId,
            },
        });
        res.status(200).json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o veículo" });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.vehicle.delete({
            where: { vehicleId: id },
        });
        res.json({ message: "Veículo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o veículo" });
    }
};
exports.deleteVehicle = deleteVehicle;
const getVehiclesByOwner = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const vehicle = await db_1.default.vehicle.findMany({
            where: { memberId: id },
            include: {
                vehicleType: true,
            },
        });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getVehiclesByOwner = getVehiclesByOwner;
const getVehicleTypes = async (req, res) => {
    try {
        const vehicleType = await db_1.default.vehicleType.findMany();
        res.json(vehicleType);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getVehicleTypes = getVehicleTypes;
const getVehiclesByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const vehicle = await db_1.default.vehicle.findMany({
            where: { lobbyId: lobby },
            include: {
                member: true,
                vehicleType: true,
                lobby: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getVehiclesByLobby = getVehiclesByLobby;
const getFilteredVehicles = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { licensePlate: { contains: query } },
                    { model: { contains: query } },
                    { brand: { contains: query } },
                    { member: { name: { contains: query } } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const vehicle = await db_1.default.vehicle.findMany({
            where: whereCondition,
            include: {
                member: {
                    select: {
                        name: true,
                    },
                },
                vehicleType: true,
            },
            orderBy: [{ licensePlate: "asc" }],
        });
        if (!vehicle) {
            res.status(404).json({ error: "Nenhum veículo encontrado" });
            return;
        }
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getFilteredVehicles = getFilteredVehicles;
