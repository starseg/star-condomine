import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const scheduling = await prisma.scheduling.findMany();
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os agendamentos" });
  }
};

export const getScheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const scheduling = await prisma.scheduling.findUniqueOrThrow({
      where: { schedulingId: id },
      include: {
        visitor: {
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
    });
    if (!scheduling) {
      res.status(404).json({ error: "Agendamento não encontrado" });
      return;
    }
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o agendamento" });
  }
};

export const createScheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      reason,
      location,
      startDate,
      endDate,
      visitorId,
      lobbyId,
      memberId,
      operatorId,
    } = req.body;
    const scheduling = await prisma.scheduling.create({
      data: {
        reason,
        location,
        startDate,
        endDate,
        visitorId,
        lobbyId,
        memberId,
        operatorId,
      },
    });
    res.status(201).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o agendamento" });
  }
};

export const updateScheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      reason,
      location,
      startDate,
      endDate,
      status,
      visitorId,
      lobbyId,
      memberId,
      operatorId,
    } = req.body;
    const scheduling = await prisma.scheduling.update({
      where: { schedulingId: id },
      data: {
        reason,
        location,
        startDate,
        endDate,
        status,
        visitorId,
        lobbyId,
        memberId,
        operatorId,
      },
    });
    res.status(200).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o agendamento" });
  }
};

export const deleteScheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.scheduling.delete({
      where: { schedulingId: id },
    });
    res.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o agendamento" });
  }
};
export const getSchedulingsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const scheduling = await prisma.scheduling.findMany({
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
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }],
    });
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const getFilteredSchedulings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;

    const whereCondition = query
      ? {
          OR: [
            { visitor: { name: { contains: query as string } } },
            { member: { name: { contains: query as string } } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const scheduling = await prisma.scheduling.findMany({
      where: whereCondition,
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
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }],
    });
    if (!scheduling) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const getActiveSchedulingsByVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const visitor = parseInt(req.params.visitor, 10);
    const scheduling = await prisma.scheduling.findMany({
      where: { visitorId: visitor, status: "ACTIVE", endDate: { gte: today } },
    });
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
