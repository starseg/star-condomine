import { Request, Response } from "express";
import prisma from "../db";

export const getAllAreaAccessRules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const areaAccessRule = await prisma.areaAccessRule.findMany({
      orderBy: [{ areaAccessRuleId: "asc" }],
      include: {
        lobby: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    });
    res.json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};

export const getAreaAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const areaAccessRule = await prisma.areaAccessRule.findUniqueOrThrow({
      where: { areaAccessRuleId: id },
      include: {
        lobby: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    });
    if (!areaAccessRule) {
      res.status(404).json({ error: "grupo não encontrado" });
      return;
    }
    res.json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};

export const createAreaAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accessRuleId, areaId } = req.body;
    const areaAccessRule = await prisma.areaAccessRule.create({
      data: { accessRuleId, areaId },
    });
    res.status(201).json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};

export const updateAreaAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, areaId } = req.body;
    const areaAccessRule = await prisma.areaAccessRule.update({
      where: { areaAccessRuleId: id },
      data: { accessRuleId, areaId },
    });
    res.status(200).json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};

export const deleteAreaAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.areaAccessRule.delete({
      where: { areaAccessRuleId: id },
    });
    res.json({ message: "grupo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};
