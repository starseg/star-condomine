import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLobbyProblems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobbyProblem = await prisma.lobbyProblem.findMany();
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os problemas" });
  }
};

export const getLobbyProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobbyProblem = await prisma.lobbyProblem.findUniqueOrThrow({
      where: { lobbyProblemId: id },
    });
    if (!lobbyProblem) {
      res.status(404).json({ error: "Problema não encontrado" });
      return;
    }
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o problema" });
  }
};

export const createLobbyProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, date, lobbyId, operatorId } = req.body;
    const lobbyProblem = await prisma.lobbyProblem.create({
      data: { title, description, date, lobbyId, operatorId },
    });
    res.status(201).json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o problema" });
  }
};

export const updateLobbyProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, date, status, lobbyId, operatorId } = req.body;
    const lobbyProblem = await prisma.lobbyProblem.update({
      where: { lobbyProblemId: id },
      data: { title, description, date, status, lobbyId, operatorId },
    });
    res.status(200).json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o problema" });
  }
};

export const deleteLobbyProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.lobbyProblem.delete({
      where: { lobbyProblemId: id },
    });
    res.json({ message: "Problema excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o problema" });
  }
};

export const getProblemsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const lobbyProblem = await prisma.lobbyProblem.findMany({
      where: { lobbyId: lobby },
      include: { operator: true },
      orderBy: [{ status: "desc" }, { date: "asc" }],
    });
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os problemas" });
  }
};
