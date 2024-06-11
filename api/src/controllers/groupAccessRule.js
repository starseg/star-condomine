"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupAccessRule = exports.updateGroupAccessRule = exports.createGroupAccessRule = exports.getGroupAccessRule = exports.getAllGroupAccessRules = void 0;
const db_1 = __importDefault(require("../db"));
const getAllGroupAccessRules = async (req, res) => {
    try {
        const groupAccessRule = await db_1.default.groupAccessRule.findMany({
            orderBy: [{ groupAccessRuleId: "asc" }],
        });
        res.json(groupAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os grupos" });
    }
};
exports.getAllGroupAccessRules = getAllGroupAccessRules;
const getGroupAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const groupAccessRule = await db_1.default.groupAccessRule.findUniqueOrThrow({
            where: { groupAccessRuleId: id },
        });
        if (!groupAccessRule) {
            res.status(404).json({ error: "grupo não encontrado" });
            return;
        }
        res.json(groupAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o grupo" });
    }
};
exports.getGroupAccessRule = getGroupAccessRule;
const createGroupAccessRule = async (req, res) => {
    try {
        const { accessRuleId, groupId } = req.body;
        const groupAccessRule = await db_1.default.groupAccessRule.create({
            data: { accessRuleId, groupId },
        });
        res.status(201).json(groupAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o grupo" });
    }
};
exports.createGroupAccessRule = createGroupAccessRule;
const updateGroupAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { accessRuleId, groupId } = req.body;
        const groupAccessRule = await db_1.default.groupAccessRule.update({
            where: { groupAccessRuleId: id },
            data: { accessRuleId, groupId },
        });
        res.status(200).json(groupAccessRule);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o grupo" });
    }
};
exports.updateGroupAccessRule = updateGroupAccessRule;
const deleteGroupAccessRule = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.groupAccessRule.delete({
            where: { groupAccessRuleId: id },
        });
        res.json({ message: "grupo excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o grupo" });
    }
};
exports.deleteGroupAccessRule = deleteGroupAccessRule;
