"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotification = exports.getAllNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllNotifications = async (req, res) => {
    try {
        const notification = await prisma.notification.findMany({
            orderBy: [{ status: "asc" }, { createdAt: "asc" }],
        });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as notificações" });
    }
};
exports.getAllNotifications = getAllNotifications;
const getNotification = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const notification = await prisma.notification.findUniqueOrThrow({
            where: { notificationId: id },
        });
        if (!notification) {
            res.status(404).json({ error: "notificação não encontrada" });
            return;
        }
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a notificação" });
    }
};
exports.getNotification = getNotification;
const createNotification = async (req, res) => {
    try {
        const { title, message, date } = req.body;
        const notification = await prisma.notification.create({
            data: { title, message, date },
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a notificação" });
    }
};
exports.createNotification = createNotification;
const updateNotification = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { title, message, date, status } = req.body;
        const notification = await prisma.notification.update({
            where: { notificationId: id },
            data: { title, message, date, status },
        });
        res.status(200).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a notificação" });
    }
};
exports.updateNotification = updateNotification;
const deleteNotification = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.notification.delete({
            where: { notificationId: id },
        });
        res.json({ message: "notificação excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a notificação" });
    }
};
exports.deleteNotification = deleteNotification;
