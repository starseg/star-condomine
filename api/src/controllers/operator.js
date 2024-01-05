"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOperator = exports.updateOperator = exports.createOperator = exports.getOperator = exports.getAllOperators = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getAllOperators = async (req, res) => {
    try {
        const operator = await prisma.operator.findMany();
        res.json(operator);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os operadores" });
    }
};
exports.getAllOperators = getAllOperators;
const getOperator = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const operator = await prisma.operator.findUniqueOrThrow({
            where: { operatorId: id },
        });
        if (!operator) {
            res.status(404).json({ error: "Operador não encontrado" });
            return;
        }
        res.json(operator);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o operador" });
    }
};
exports.getOperator = getOperator;
const createOperator = async (req, res) => {
    try {
        const { username, name, password, type } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const operator = await prisma.operator.create({
            data: { username, name, password: hashedPassword, type },
        });
        res.status(201).json(operator);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o operador" });
    }
};
exports.createOperator = createOperator;
const updateOperator = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { username, name, password, type, status } = req.body;
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt_1.default.hash(password, 10);
        }
        const operator = await prisma.operator.update({
            where: { operatorId: id },
            data: {
                username,
                name,
                password: hashedPassword || undefined,
                type,
                status,
            },
        });
        res.status(200).json(operator);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao atualizar o operador ${error}` });
    }
};
exports.updateOperator = updateOperator;
const deleteOperator = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.operator.delete({
            where: { operatorId: id },
        });
        res.json({ message: "Operador excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o operador" });
    }
};
exports.deleteOperator = deleteOperator;
