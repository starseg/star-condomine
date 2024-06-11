import { Request, Response } from "express";
import prisma from "../db";

export const getAllGroupAccessRules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupAccessRule = await prisma.groupAccessRule.findMany({
      orderBy: [{ groupAccessRuleId: "asc" }],
    });
    res.json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};

export const getGroupAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const groupAccessRule = await prisma.groupAccessRule.findUniqueOrThrow({
      where: { groupAccessRuleId: id },
    });
    if (!groupAccessRule) {
      res.status(404).json({ error: "grupo não encontrado" });
      return;
    }
    res.json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};

export const createGroupAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accessRuleId, groupId } = req.body;
    const groupAccessRule = await prisma.groupAccessRule.create({
      data: { accessRuleId, groupId },
    });
    res.status(201).json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};

export const updateGroupAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, groupId } = req.body;
    const groupAccessRule = await prisma.groupAccessRule.update({
      where: { groupAccessRuleId: id },
      data: { accessRuleId, groupId },
    });
    res.status(200).json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};

export const deleteGroupAccessRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.groupAccessRule.delete({
      where: { groupAccessRuleId: id },
    });
    res.json({ message: "grupo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};
