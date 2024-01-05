"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicleTypes = exports.getVehiclesByOwner = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicle = exports.getAllVehicles = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllVehicles = async (req, res) => {
    try {
        const vehicle = await prisma.vehicle.findMany({
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
        const vehicle = await prisma.vehicle.findUniqueOrThrow({
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
        const { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId, } = req.body;
        const vehicle = await prisma.vehicle.create({
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
        const vehicle = await prisma.vehicle.update({
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
        await prisma.vehicle.delete({
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
        const vehicle = await prisma.vehicle.findMany({
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
        const vehicleType = await prisma.vehicleType.findMany();
        res.json(vehicleType);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os veículos" });
    }
};
exports.getVehicleTypes = getVehicleTypes;
