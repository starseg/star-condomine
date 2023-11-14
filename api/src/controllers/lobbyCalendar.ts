import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLobbyCalendars = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobbyCalendar = await prisma.lobbyCalendar.findMany();
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as datas" });
  }
};

export const getLobbyCalendar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobbyCalendar = await prisma.lobbyCalendar.findUniqueOrThrow({
      where: { lobbyCalendarId: id },
    });
    if (!lobbyCalendar) {
      res.status(404).json({ error: "data não encontrada" });
      return;
    }
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a data" });
  }
};

export const createLobbyCalendar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { description, date, lobbyId } = req.body;
    const lobbyCalendar = await prisma.lobbyCalendar.create({
      data: { description, date, lobbyId },
    });
    res.status(201).json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a data" });
  }
};

export const updateLobbyCalendar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, date, lobbyId } = req.body;
    const lobbyCalendar = await prisma.lobbyCalendar.update({
      where: { lobbyCalendarId: id },
      data: { description, date, lobbyId },
    });
    res.status(201).json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a data" });
  }
};

export const deleteLobbyCalendar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.lobbyCalendar.delete({
      where: { lobbyCalendarId: id },
    });
    res.json({ message: "data excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a data" });
  }
};