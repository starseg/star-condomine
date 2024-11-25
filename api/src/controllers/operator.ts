import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getAllOperators = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const operator = await prisma.operator.findMany({
      orderBy: [{ status: "asc" }, { type: "desc" }, { name: "asc" }],
    });
    res.json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os operadores" });
  }
};

export const getOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const operator = await prisma.operator.findUniqueOrThrow({
      where: { operatorId: id },
    });
    if (!operator) {
      res.status(404).json({ error: "Operador não encontrado" });
      return;
    }
    res.json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o operador" });
  }
};

export const createOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, name, password, type, lobbyId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const operator = await prisma.operator.create({
      data: { username, name, password: hashedPassword, type, lobbyId },
    });
    res.status(201).json(operator);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o operador" });
  }
};

export const updateOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, name, password, type, status, lobbyId } = req.body;
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const operator = await prisma.operator.update({
      where: { operatorId: id },
      data: {
        username,
        name,
        password: hashedPassword || undefined,
        type,
        status,
        lobbyId,
      },
    });
    res.status(200).json(operator);
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar o operador ${error}` });
  }
};

export const deleteOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.operator.delete({
      where: { operatorId: id },
    });
    res.json({ message: "Operador excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o operador" });
  }
};
