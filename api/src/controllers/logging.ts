import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLoggings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const formattedDate = date.toISOString();
    const logging = await prisma.logging.findMany({
      where: {
        date: {
          gte: formattedDate,
        },
      },
      include: {
        operator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ date: "desc" }],
    });
    res.json(logging);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os registros" });
  }
};

export const getLogging = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const logging = await prisma.logging.findUniqueOrThrow({
      where: { logId: id },
    });
    if (!logging) {
      res.status(404).json({ error: "Registro não encontrado" });
      return;
    }
    res.json(logging);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o registro" });
  }
};

export const createLogging = async (
  method: string,
  url: string,
  userAgent: string,
  operatorId: number
): Promise<void> => {
  try {
    const logging = await prisma.logging.create({
      data: { method, url, userAgent, operatorId },
    });
    console.log("Registro de logging criado:", logging);
  } catch (error) {
    console.error("Erro ao criar o registro de logging:", error);
    throw error; // Propaga o erro para o chamador, se necessário
  }
};

export const deleteLogging = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.logging.delete({
      where: { logId: id },
    });
    res.json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o registro" });
  }
};
