import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const access = await prisma.access.findMany();
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const getAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const access = await prisma.access.findUniqueOrThrow({
      where: { accessId: id },
    });
    if (!access) {
      res.status(404).json({ error: "Acesso não encontrado" });
      return;
    }
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o acesso" });
  }
};

export const createAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      memberId,
      lobbyId,
      visitorId,
      operatorId,
    } = req.body;
    const access = await prisma.access.create({
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        memberId,
        lobbyId,
        visitorId,
        operatorId,
      },
    });
    res.status(201).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o acesso" });
  }
};

export const updateAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      status,
      memberId,
      lobbyId,
      visitorId,
      operatorId,
    } = req.body;
    const access = await prisma.access.update({
      where: { accessId: id },
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        status,
        memberId,
        lobbyId,
        visitorId,
        operatorId,
      },
    });
    res.status(200).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o acesso" });
  }
};

export const deleteAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.access.delete({
      where: { accessId: id },
    });
    res.json({ message: "Acesso excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o acesso" });
  }
};
export const getAccessByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const access = await prisma.access.findMany({
      where: { lobbyId: lobby },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
    });
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
