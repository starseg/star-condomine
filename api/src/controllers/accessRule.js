"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccessRule = exports.updateAccessRule = exports.createAccessRule = exports.getAccessRule = exports.getAllAccessRules = void 0;
const db_1 = __importDefault(require("../db"));
const getAllAccessRules = async (req, res) => {
    try {
        const accessRule = await db_1.default.accessRule.findMany({
            orderBy: [{ accessRuleId: "asc" }],
        });
        res.json(accessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as regras de acesso" });
    }
};
exports.getAllAccessRules = getAllAccessRules;
const getAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const accessRule = await db_1.default.accessRule.findUniqueOrThrow({
            where: { accessRuleId: id },
        });
        if (!accessRule) {
            res.status(404).json({ error: "regra de acesso não encontrada" });
            return;
        }
        res.json(accessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a regra de acesso" });
    }
};
exports.getAccessRule = getAccessRule;
const createAccessRule = async (req, res) => {
    try {
        const { name, type, priority } = req.body;
        const accessRule = await db_1.default.accessRule.create({
            data: { name, type, priority },
        });
        res.status(201).json(accessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a regra de acesso" });
    }
};
exports.createAccessRule = createAccessRule;
const updateAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, type, priority } = req.body;
        const accessRule = await db_1.default.accessRule.update({
            where: { accessRuleId: id },
            data: { name, type, priority },
        });
        res.status(200).json(accessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a regra de acesso" });
    }
};
exports.updateAccessRule = updateAccessRule;
const deleteAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.accessRule.delete({
            where: { accessRuleId: id },
        });
        res.json({ message: "regra de acesso excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a regra de acesso" });
    }
};
exports.deleteAccessRule = deleteAccessRule;
