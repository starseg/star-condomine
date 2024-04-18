"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeedback = exports.updateFeedback = exports.createFeedback = exports.getFeedback = exports.getAllFeedbacks = void 0;
const db_1 = __importDefault(require("../db"));
const getAllFeedbacks = async (req, res) => {
    try {
        const feedback = await db_1.default.feedback.findMany({
            orderBy: [{ status: "asc" }, { createdAt: "asc" }],
        });
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os feedbacks" });
    }
};
exports.getAllFeedbacks = getAllFeedbacks;
const getFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const feedback = await db_1.default.feedback.findUniqueOrThrow({
            where: { feedbackId: id },
        });
        if (!feedback) {
            res.status(404).json({ error: "feedback não encontrado" });
            return;
        }
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o feedback" });
    }
};
exports.getFeedback = getFeedback;
const createFeedback = async (req, res) => {
    try {
        const { name, subject, message } = req.body;
        const Feedback = await db_1.default.feedback.create({
            data: { name, subject, message },
        });
        res.status(201).json(Feedback);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o feedback" });
    }
};
exports.createFeedback = createFeedback;
const updateFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, subject, message, response, status } = req.body;
        const feedback = await db_1.default.feedback.update({
            where: { feedbackId: id },
            data: { name, subject, message, response, status },
        });
        res.status(200).json(feedback);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o feedback" });
    }
};
exports.updateFeedback = updateFeedback;
const deleteFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.feedback.delete({
            where: { feedbackId: id },
        });
        res.json({ message: "feedback excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o feedback" });
    }
};
exports.deleteFeedback = deleteFeedback;
