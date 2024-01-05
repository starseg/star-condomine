"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceByLobby = exports.getDeviceModels = exports.deleteDevice = exports.updateDevice = exports.createDevice = exports.getDevice = exports.getAllDevices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllDevices = async (req, res) => {
    try {
        const device = await prisma.device.findMany();
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
        const device = await prisma.device.findUniqueOrThrow({
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
        const device = await prisma.device.create({
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
        const device = await prisma.device.update({
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
        await prisma.device.delete({
            where: { deviceId: id },
        });
        res.json({ message: "Dispositivo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o dispositivo" });
    }
};
exports.deleteDevice = deleteDevice;
const getDeviceModels = async (req, res) => {
    try {
        const device = await prisma.deviceModel.findMany();
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os modelos" });
    }
};
exports.getDeviceModels = getDeviceModels;
const getDeviceByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const device = await prisma.device.findMany({
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
