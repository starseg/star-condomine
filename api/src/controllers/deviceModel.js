"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeviceModel = exports.updateDeviceModel = exports.createDeviceModel = exports.getDeviceModels = exports.getDeviceModel = void 0;
const db_1 = __importDefault(require("../db"));
const getDeviceModel = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const device = await db_1.default.deviceModel.findUniqueOrThrow({
            where: { deviceModelId: id },
        });
        if (!device) {
            res.status(404).json({ error: "Modelo não encontrado" });
            return;
        }
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o modelo" });
    }
};
exports.getDeviceModel = getDeviceModel;
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
const createDeviceModel = async (req, res) => {
    try {
        const { model, brand, description, isFacial } = req.body;
        const device = await db_1.default.deviceModel.create({
            data: { model, brand, description, isFacial },
        });
        res.status(201).json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o modelo de dispositivo" });
    }
};
exports.createDeviceModel = createDeviceModel;
const updateDeviceModel = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { model, brand, description, isFacial } = req.body;
        const device = await db_1.default.deviceModel.update({
            where: { deviceModelId: id },
            data: { model, brand, description, isFacial },
        });
        res.status(200).json(device);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Erro ao atualizar o modelo de dispositivo" });
    }
};
exports.updateDeviceModel = updateDeviceModel;
const deleteDeviceModel = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.deviceModel.delete({
            where: { deviceModelId: id },
        });
        res.json({ message: "Modelo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o modelo de dispositivo" });
    }
};
exports.deleteDeviceModel = deleteDeviceModel;
