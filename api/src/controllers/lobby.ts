import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLobbies = async (req: Request, res: Response): Promise<void> => {
  try {
    const lobby = await prisma.lobby.findMany();
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as portarias" });
  }
};

export const getLobby = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobby = await prisma.lobby.findUniqueOrThrow({
      where: { lobbyId: id },
    });
    if (!lobby) {
      res.status(404).json({ error: "Portaria não encontrada" });
      return;
    }
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a portaria" });
  }
};

export const createLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cnpj, name, responsible, telephone, schedules, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type } = req.body;
    const lobby = await prisma.lobby.create({
      data: { cnpj, name, responsible, telephone, schedules, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type },
    });
    res.status(201).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a portaria" });
  }
};

export const updateLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { cnpj, name, responsible, telephone, schedules, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type } = req.body;
    const lobby = await prisma.lobby.update({
      where: { lobbyId: id },
      data: { cnpj, name, responsible, telephone, schedules, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type },
    });
    res.status(200).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a portaria" });
  }
};

export const deleteLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.lobby.delete({
      where: { lobbyId: id },
    });
    res.json({ message: "Portaria excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a portaria" });
  }
};
