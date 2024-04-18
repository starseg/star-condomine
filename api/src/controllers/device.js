"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceModels = exports.getFilteredDevices = exports.getDeviceByLobby = exports.deleteDevice = exports.updateDevice = exports.createDevice = exports.getDevice = exports.getAllDevices = void 0;
const db_1 = __importDefault(require("../db"));
const getAllDevices = async (req, res) => {
    try {
        const device = await db_1.default.device.findMany();
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dispositivos" });
    }
};
exports.getAllDevices = getAllDevices;
const getDevice = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const device = await db_1.default.device.findUniqueOrThrow({
            where: { deviceId: id },
        });
        if (!device) {
            res.status(404).json({ error: "Dispositivo não encontrado" });
            return;
        }
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o dispositivo" });
    }
};
exports.getDevice = getDevice;
const createDevice = async (req, res) => {
    try {
        const { name, ip, ramal, description, deviceModelId, lobbyId } = req.body;
        const device = await db_1.default.device.create({
            data: { name, ip, ramal, description, deviceModelId, lobbyId },
        });
        res.status(201).json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o dispositivo" });
    }
};
exports.createDevice = createDevice;
const updateDevice = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, ip, ramal, description, deviceModelId, lobbyId } = req.body;
        const device = await db_1.default.device.update({
            where: { deviceId: id },
            data: { name, ip, ramal, description, deviceModelId, lobbyId },
        });
        res.status(200).json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o dispositivo" });
    }
};
exports.updateDevice = updateDevice;
const deleteDevice = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.device.delete({
            where: { deviceId: id },
        });
        res.json({ message: "Dispositivo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o dispositivo" });
    }
};
exports.deleteDevice = deleteDevice;
const getDeviceByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const device = await db_1.default.device.findMany({
            where: { lobbyId: lobby },
            include: { deviceModel: true },
        });
        if (!device) {
            res.status(404).json({ error: "Dispositivos não encontrados" });
            return;
        }
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dispositivos" });
    }
};
exports.getDeviceByLobby = getDeviceByLobby;
const getFilteredDevices = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { name: { contains: query } },
                    { ip: { contains: query } },
                    { description: { contains: query } },
                    { deviceModel: { model: { contains: query } } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const device = await db_1.default.device.findMany({
            where: whereCondition,
            include: {
                deviceModel: true,
            },
            orderBy: [{ name: "asc" }],
        });
        if (!device) {
            res.status(404).json({ error: "Nenhum veículo encontrado" });
            return;
        }
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getFilteredDevices = getFilteredDevices;
// MODELOS DE DISPOSITIVO
const getDeviceModels = async (req, res) => {
    try {
        const device = await db_1.default.deviceModel.findMany();
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os modelos" });
    }
};
exports.getDeviceModels = getDeviceModels;
