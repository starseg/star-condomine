import { Request, Response } from "express";
import prisma from "../db";

export const getAllTimeZones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const timeZone = await prisma.timeZone.findMany({
      orderBy: [{ timeZoneId: "asc" }],
    });
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeZones" });
  }
};

export const getTimeZonesByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const timeZone = await prisma.timeZone.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ timeZoneId: "asc" }],
    });
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeZones" });
  }
};

export const getTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const timeZone = await prisma.timeZone.findUniqueOrThrow({
      where: { timeZoneId: id },
    });
    if (!timeZone) {
      res.status(404).json({ error: "TimeZone não encontrado" });
      return;
    }
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o TimeZone" });
  }
};

export const createTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, lobbyId } = req.body;
    const timeZone = await prisma.timeZone.create({
      data: { name, lobbyId },
    });
    res.status(201).json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o TimeZone" });
  }
};

export const updateTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, lobbyId } = req.body;
    const timeZone = await prisma.timeZone.update({
      where: { timeZoneId: id },
      data: { name, lobbyId },
    });
    res.status(200).json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o timeZone" });
  }
};

export const deleteTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.timeZone.delete({
      where: { timeZoneId: id },
    });
    res.json({ message: "timeZone excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o timeZone" });
  }
};
