"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAreaAccessRule = exports.updateAreaAccessRule = exports.createAreaAccessRule = exports.getAreaAccessRule = exports.getAllAreaAccessRules = void 0;
const db_1 = __importDefault(require("../db"));
const getAllAreaAccessRules = async (req, res) => {
    try {
        const areaAccessRule = await db_1.default.areaAccessRule.findMany({
            orderBy: [{ areaAccessRuleId: "asc" }],
            include: {
                lobby: {
                    select: { name: true },
                },
                accessRule: {
                    select: { name: true },
                },
            },
        });
        res.json(areaAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os grupos" });
    }
};
exports.getAllAreaAccessRules = getAllAreaAccessRules;
const getAreaAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const areaAccessRule = await db_1.default.areaAccessRule.findUniqueOrThrow({
            where: { areaAccessRuleId: id },
            include: {
                lobby: {
                    select: { name: true },
                },
                accessRule: {
                    select: { name: true },
                },
            },
        });
        if (!areaAccessRule) {
            res.status(404).json({ error: "grupo não encontrado" });
            return;
        }
        res.json(areaAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o grupo" });
    }
};
exports.getAreaAccessRule = getAreaAccessRule;
const createAreaAccessRule = async (req, res) => {
    try {
        const { accessRuleId, areaId } = req.body;
        const areaAccessRule = await db_1.default.areaAccessRule.create({
            data: { accessRuleId, areaId },
        });
        res.status(201).json(areaAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o grupo" });
    }
};
exports.createAreaAccessRule = createAreaAccessRule;
const updateAreaAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { accessRuleId, areaId } = req.body;
        const areaAccessRule = await db_1.default.areaAccessRule.update({
            where: { areaAccessRuleId: id },
            data: { accessRuleId, areaId },
        });
        res.status(200).json(areaAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o grupo" });
    }
};
exports.updateAreaAccessRule = updateAreaAccessRule;
const deleteAreaAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.areaAccessRule.delete({
            where: { areaAccessRuleId: id },
        });
        res.json({ message: "grupo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o grupo" });
    }
};
exports.deleteAreaAccessRule = deleteAreaAccessRule;
