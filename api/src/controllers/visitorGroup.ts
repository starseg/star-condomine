import { Request, Response } from "express";
import prisma from "../db";

export const getAllVisitorGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const visitorGroup = await prisma.visitorGroup.findMany({
      orderBy: [{ visitorGroupId: "asc" }],
      include: {
        visitor: {
          select: { name: true },
        },
        group: {
          select: { name: true },
        },
      },
    });
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relações" });
  }
};

export const getVisitorGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const visitorGroup = await prisma.visitorGroup.findUniqueOrThrow({
      where: { visitorGroupId: id },
      include: {
        visitor: {
          select: { name: true },
        },
        group: {
          select: { name: true },
        },
      },
    });
    if (!visitorGroup) {
      res.status(404).json({ error: "relação não encontrada" });
      return;
    }
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relação" });
  }
};

export const getVisitorGroupsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const visitorGroup = await prisma.visitorGroup.findMany({
      orderBy: [{ visitorGroupId: "asc" }],
      include: {
        visitor: {
          select: { name: true },
        },
        group: {
          select: { name: true },
        },
      },
      where: {
        group: {
          lobbyId: lobby,
        },
        visitor: {
          lobbyId: lobby,
        },
      },
    });
    res.json(visitorGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relações" });
  }
};

export const createVisitorGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { visitorId, groupId } = req.body;
    const visitorgroup = await prisma.visitorGroup.create({
      data: { visitorId, groupId },
    });
    res.status(201).json(visitorgroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar relação" });
  }
};

export const updateVisitorGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { visitorId, groupId } = req.body;
    const visitorgroup = await prisma.visitorGroup.update({
      where: { visitorGroupId: id },
      data: { visitorId, groupId },
    });
    res.status(200).json(visitorgroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar relação" });
  }
};

export const deleteVisitorGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.visitorGroup.delete({
      where: { visitorGroupId: id },
    });
    res.json({ message: "relação excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir relação" });
  }
};
