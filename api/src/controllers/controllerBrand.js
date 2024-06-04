"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrand = exports.getAllBrands = void 0;
const db_1 = __importDefault(require("../db"));
const getAllBrands = async (req, res) => {
    try {
        const device = await db_1.default.controllerBrand.findMany();
        res.json(device);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as marcas" });
    }
};
exports.getAllBrands = getAllBrands;
const getBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const controllerBrand = await db_1.default.controllerBrand.findUniqueOrThrow({
            where: { controllerBrandId: id },
        });
        if (!controllerBrand) {
            res.status(404).json({ error: "Marca não encontrada" });
            return;
        }
        res.json(controllerBrand);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a marca" });
    }
};
exports.getBrand = getBrand;
const createBrand = async (req, res) => {
    try {
        const { name, iconUrl } = req.body;
        const controllerBrand = await db_1.default.controllerBrand.create({
            data: { name, iconUrl },
        });
        res.status(201).json(controllerBrand);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a marca" });
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, iconUrl } = req.body;
        const controllerBrand = await db_1.default.controllerBrand.update({
            where: { controllerBrandId: id },
            data: { name, iconUrl },
        });
        res.status(200).json(controllerBrand);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a marca" });
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.controllerBrand.delete({
            where: { controllerBrandId: id },
        });
        res.json({ message: "Marca excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a marca" });
    }
};
exports.deleteBrand = deleteBrand;
