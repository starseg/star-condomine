import { Request, Response } from "express";
import prisma from "../db";

export const getAllAccessRuleTimeZones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accessRuleTimeZone = await prisma.accessRuleTimeZone.findMany({
      orderBy: [{ accessRuleTimeZoneId: "asc" }],
      include: {
        timeZone: {
          select: { name: true },
        },
        accessRule: {
          select: { name: true },
        },
      },
    });
    res.json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};

export const getAccessRuleTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const accessRuleTimeZone =
      await prisma.accessRuleTimeZone.findUniqueOrThrow({
        where: { accessRuleTimeZoneId: id },
        include: {
          timeZone: {
            select: { name: true },
          },
          accessRule: {
            select: { name: true },
          },
        },
      });
    if (!accessRuleTimeZone) {
      res.status(404).json({ error: "grupo não encontrado" });
      return;
    }
    res.json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};

export const createAccessRuleTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accessRuleId, timeZoneId } = req.body;
    const accessRuleTimeZone = await prisma.accessRuleTimeZone.create({
      data: { accessRuleId, timeZoneId },
    });
    res.status(201).json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};

export const updateAccessRuleTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, timeZoneId } = req.body;
    const accessRuleTimeZone = await prisma.accessRuleTimeZone.update({
      where: { accessRuleTimeZoneId: id },
      data: { accessRuleId, timeZoneId },
    });
    res.status(200).json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};

export const deleteAccessRuleTimeZone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.accessRuleTimeZone.delete({
      where: { accessRuleTimeZoneId: id },
    });
    res.json({ message: "grupo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};
