import { Request, Response } from "express";
import prisma from "../db";

export const getAllNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  try {
    const notification = await prisma.notification.findMany({
      orderBy: [{ date: "desc" }],
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as notificações" });
  }
};

export const getActiveNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  try {
    const notification = await prisma.notification.findMany({
      where: {
        date: {
          lte: currentDate,
          gte: sevenDaysAgo,
        },
        status: "ACTIVE",
      },
      orderBy: [{ date: "desc" }],
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as notificações" });
  }
};

export const getNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a notificação" });
  }
};

export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, message, date } = req.body;
    const notification = await prisma.notification.create({
      data: { title, message, date },
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a notificação" });
  }
};

export const updateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, message, date, status } = req.body;
    const notification = await prisma.notification.update({
      where: { notificationId: id },
      data: { title, message, date, status },
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a notificação" });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.notification.delete({
      where: { notificationId: id },
    });
    res.json({ message: "notificação excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a notificação" });
  }
};
