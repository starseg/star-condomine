import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllschedules = async (
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

export const getscheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const scheduling = await prisma.scheduling.findUniqueOrThrow({
      where: { schedulingId: id },
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

export const createscheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reason, location, startDate, endDate, visitorId, lobbyId, memberId, operatorId } = req.body;
    const scheduling = await prisma.scheduling.create({
      data: { reason, location, startDate, endDate, visitorId, lobbyId, memberId, operatorId },
    });
    res.status(201).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o agendamento" });
  }
};

export const updatescheduling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason, location, startDate, endDate, visitorId, lobbyId, memberId, operatorId } = req.body;
    const scheduling = await prisma.scheduling.update({
      where: { schedulingId: id },
      data: { reason, location, startDate, endDate, visitorId, lobbyId, memberId, operatorId },
    });
    res.status(201).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o agendamento" });
  }
};

export const deletescheduling = async (
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
