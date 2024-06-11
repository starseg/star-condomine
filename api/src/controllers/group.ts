import { Request, Response } from "express";
import prisma from "../db";

export const getAllGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await prisma.group.findMany({
      orderBy: [{ groupId: "asc" }],
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};

export const getGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const group = await prisma.group.findUniqueOrThrow({
      where: { groupId: id },
    });
    if (!group) {
      res.status(404).json({ error: "grupo não encontrado" });
      return;
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};

export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const group = await prisma.group.create({
      data: { name },
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};

export const updateGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const group = await prisma.group.update({
      where: { groupId: id },
      data: { name },
    });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};

export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.group.delete({
      where: { groupId: id },
    });
    res.json({ message: "grupo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};
