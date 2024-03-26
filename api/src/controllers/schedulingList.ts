import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSchedulingLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const schedulingList = await prisma.schedulingList.findMany({
      include: {
        lobby: {
          select: {
            name: true,
          },
        },
        member: {
          select: {
            name: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { lobby: { name: "asc" } }],
    });
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os agendamentos" });
  }
};

export const getSchedulingList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const schedulingList = await prisma.schedulingList.findUniqueOrThrow({
      where: { schedulingListId: id },
      include: {
        member: {
          select: {
            name: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
        lobby: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!schedulingList) {
      res.status(404).json({ error: "Lista não encontrada" });
      return;
    }
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a lista" });
  }
};

export const createSchedulingList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { description, lobbyId, memberId, operatorId } = req.body;
    const schedulingList = await prisma.schedulingList.create({
      data: {
        description,
        lobbyId,
        memberId,
        operatorId,
      },
    });
    res.status(201).json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a lista" });
  }
};

export const updateSchedulingList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, status, lobbyId, memberId, operatorId } = req.body;
    const schedulingList = await prisma.schedulingList.update({
      where: { schedulingListId: id },
      data: {
        description,
        status,
        lobbyId,
        memberId,
        operatorId,
      },
    });
    res.status(200).json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a lista" });
  }
};

export const deleteSchedulingList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.schedulingList.delete({
      where: { schedulingListId: id },
    });
    res.json({ message: "Lista excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a lista" });
  }
};

export const getFilteredSchedulingLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    const whereCondition = query
      ? {
          OR: [
            { description: { contains: query as string } },
            { operator: { name: { contains: query as string } } },
            { member: { name: { contains: query as string } } },
            { lobby: { name: { contains: query as string } } },
          ],
        }
      : {};
    const schedulingList = await prisma.schedulingList.findMany({
      where: whereCondition,
      include: {
        operator: {
          select: {
            name: true,
          },
        },
        member: {
          select: {
            name: true,
          },
        },
        lobby: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { lobby: { name: "asc" } }],
    });
    if (!schedulingList) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
